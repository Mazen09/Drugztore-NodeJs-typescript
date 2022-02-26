import { Server } from "http";
import { server } from "../../index";
import { Category } from "../../models/category";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";
import { seed_categories } from "../../seeding/data";

const endpoint: string = "/api/categories";

describe("api/categories", () => {
  let s: Server;

  beforeEach(async () => {
    s = server;
  });

  afterEach(async () => {
    await s.close();
    await Category.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all categories", async () => {
      await Category.collection.insertMany([
        seed_categories[0],
        seed_categories[1],
      ]);

      const res = await request(s).get("/api/categories");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toMatchObject(seed_categories[0]);
      expect(res.body[1]).toMatchObject(seed_categories[1]);
    });
  });

  describe("GET /:id", () => {
    it("should return 404 when id is invalid", async () => {
      const res = await request(s).get(`${endpoint}/${1}`);
      expect(res.status).toBe(404);
    });

    it("should return 404 when id is not in collection", async () => {
      const res = await request(s).get(
        `${endpoint}/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
    });

    it("should return category with given id", async () => {
      const category = await Category.collection.insertOne(seed_categories[0]);

      const res = await request(s).get(`${endpoint}/${category.insertedId}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(seed_categories[0]);
    });
  });

  describe("POST /", () => {
    let category: any;
    let token: string;

    const exec = async () => {
      return await request(s)
        .post(endpoint)
        .set("x-auth-token", token)
        .send({ name: category.name });
    };

    beforeEach(() => {
      const user: any = new User();
      category = { ...seed_categories[0] };
      token = user.generateAuthToken();
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is undefined", async () => {
      category.name = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if category name is less than 5 characters", async () => {
      category.name = "c";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if category name is more than 50 characters", async () => {
      category.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the category if it is valid", async () => {
      await exec();

      const categoryInDB = await Category.findOne({ name: category.name });

      expect(categoryInDB).toBeDefined();
      expect(categoryInDB).toMatchObject(category);
    });

    it("should return the category if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(category);
    });
  });

  describe("PUT /:id", () => {
    let token: string;
    let newName: any;
    let id: any;

    const exec = async () => {
      return await request(server)
        .put(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      await Category.collection.insertOne(seed_categories[0]);

      let user: any = new User();
      token = user.generateAuthToken();
      newName = "updatedName";
      id = seed_categories[0]._id;
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is undefined", async () => {
      newName = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if category name is less than 5 characters", async () => {
      newName = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if category name is more than 50 characters", async () => {
      newName = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if category with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should update the category if input is valid", async () => {
      await exec();

      const categoryInDB = await Category.findOne({ name: newName });

      expect(categoryInDB?.name).toBe(newName);
    });

    it("should return the updated category if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DETETE /:id", () => {
    let token: string;
    let id: any;

    const exec = async () => {
      return await request(server)
        .delete(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      await Category.collection.insertOne(seed_categories[0]);

      id = seed_categories[0]._id;
      let user: any = new User({ isAdmin: true });
      token = user.generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      const user: any = new User({ isAdmin: false });
      token = user.generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if category with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should delete the category if input is valid", async () => {
      await exec();

      const categoryInDB = await Category.findById(id);

      expect(categoryInDB).toBeNull();
    });

    it("should return the removed category", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(seed_categories[0]);
    });
  });
});
