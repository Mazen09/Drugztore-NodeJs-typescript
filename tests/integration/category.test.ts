import { Server } from "http";
import { server } from "../../index";
import { Category } from "../../models/category";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";

const endpoint: string = "/api/categories";

describe("api/categories", () => {
  let s: Server;

  beforeEach(async () => {
    s = server;
  });

  afterEach(async () => {
    await s.close();
    await Category.remove({});
  });

  // GET /api/categories
  // should return all categories
  describe("GET /", () => {
    it("should return all categories", async () => {
      await Category.collection.insertMany([
        { name: "category 1" },
        { name: "category 2" },
      ]);

      const res = await request(s).get("/api/categories");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g: any) => g.name === "category 1")).toBeTruthy();
      expect(res.body.some((g: any) => g.name === "category 2")).toBeTruthy();
    });
  });

  // GET /api/categories/:id
  // should return 404 when id is not in collection
  // should return category with given id
  describe("GET /:id", () => {
    it("should return 404 when id is not in collection", async () => {
      const res = await request(s).get(
        `${endpoint}/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
    });

    it("should return category with given id", async () => {
      const category = await Category.collection.insertOne({
        name: "test category",
      });

      const res = await request(s).get(`${endpoint}/${category.insertedId}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        _id: category.insertedId,
        name: "test category",
      });
    });
  });

  // POST /api/categories
  // should return 401 if client not logged in
  // should return 400 if category name is less than 5 characters
  // should return 400 if category name is more than 50 characters
  // should save the category if it is valid
  // should return the category if it is valid
  describe("POST /", () => {
    let name: string;
    let token: string;

    const exec = async () => {
      return await request(s)
        .post(endpoint)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      const user: any = new User();
      name = "category 1";
      token = user.generateAuthToken();
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is less than 5 characters", async () => {
      name = "c";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if category name is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the category if it is valid", async () => {
      await exec();

      const category = await Category.findOne({ name });

      expect(category).toBeDefined();
      expect(category).toMatchObject({ name });
    });

    it("should return the category if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", name);
    });
  });

  // PUT /api/categories/:id
  // should return 401 if client not logged in
  // should return 400 if category name is less than 5 characters
  // should return 400 if category name is more than 50 characters
  // should return 404 if id is invalid
  // should return 404 if category with the given id was not found
  // should update the category if input is valid
  // should return the updated category if it is valid
  describe("PUT /:id", () => {
    let token: string;
    let newName: string;
    let category;
    let id: any;

    const exec = async () => {
      return await request(server)
        .put(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      category = new Category({ name: "category 1" });
      await category.save();

      let user: any = new User();
      token = user.generateAuthToken();
      id = category._id;
      newName = "updatedName";
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
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

  // DELETE /api/categories/:id
  // should return 401 if client is not logged in
  // should return 403 if the user is not an admin
  // should return 404 if id is invalid
  // should return 404 if no category with the given id was found
  // should delete the category if input is valid
  // should return the removed category
  describe("DETETE /:id", () => {
    let token: string;
    let category: any;
    let id: any;

    const exec = async () => {
      return await request(server)
        .delete(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      category = new Category({ name: "category 1" });
      await category.save();

      id = category._id;
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
      expect(res.body).toHaveProperty("_id", category._id.toHexString());
      expect(res.body).toHaveProperty("name", category.name);
    });
  });
});
