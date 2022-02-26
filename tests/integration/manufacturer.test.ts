import { Server } from "http";
import { server } from "../../index";
import { Manufacturer } from "../../models/manufacturer";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";
import { seed_manufactureres } from "../../seeding/data";

jest.useFakeTimers("legacy");

const endpoint: string = "/api/manufactureres";

describe(`${endpoint}`, () => {
  let s: Server;

  beforeEach(async () => {
    s = server;
  });

  afterEach(async () => {
    await s.close();
    await Manufacturer.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all manufactureres", async () => {
      await Manufacturer.collection.insertMany([
        seed_manufactureres[0],
        seed_manufactureres[1],
      ]);

      const res = await request(s).get(`${endpoint}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toMatchObject(seed_manufactureres[0]);
      expect(res.body[1]).toMatchObject(seed_manufactureres[1]);
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if id is invalid", async () => {
      const res = await request(s).get(`${endpoint}/1`);
      expect(res.status).toBe(404);
    });

    it("should return 404 when id is not in collection", async () => {
      const res = await request(s).get(
        `${endpoint}/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
    });

    it("should return manufacturer with given id", async () => {
      await Manufacturer.collection.insertOne(seed_manufactureres[0]);

      const res = await request(s).get(
        `${endpoint}/${seed_manufactureres[0]._id}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(seed_manufactureres[0]);
    });
  });

  describe("POST /", () => {
    let manufacturer: any;
    let oldManufacturer: any;
    let token: string;

    const exec = async () => {
      return request(s).post(endpoint).set("x-auth-token", token).send({
        name: manufacturer.name,
        email: manufacturer.email,
        mobile: manufacturer.mobile,
        address: manufacturer.address,
      });
    };

    beforeEach(() => {
      manufacturer = { ...seed_manufactureres[0] };
      oldManufacturer = { ...seed_manufactureres[1] };
      const user: any = new User();
      token = user.generateAuthToken();
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if name is undefined", async () => {
      manufacturer.name = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is less than 5 characters", async () => {
      manufacturer.name = "m";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is more than 50 characters", async () => {
      manufacturer.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is undefined", async () => {
      manufacturer.mobile = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is less than 10 characters", async () => {
      manufacturer.mobile = new Array(5).join("1");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is more than 50 characters", async () => {
      manufacturer.mobile = new Array(52).join("1");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    xit("should return 400 if mobile is not unique", async () => {
      await Manufacturer.collection.insertOne(oldManufacturer);
      manufacturer.mobile = oldManufacturer.mobile;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is invalid", async () => {
      manufacturer.mobile = new Array(5).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is undefined", async () => {
      manufacturer.address = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is less than 5 characters", async () => {
      manufacturer.address = "m";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is more than 255 characters", async () => {
      manufacturer.address = new Array(257).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    xit("should return 400 if address is not unique", async () => {
      const oldManufacturer = { ...seed_manufactureres[1] };
      oldManufacturer.address = manufacturer.address;
      await Manufacturer.collection.insertOne(oldManufacturer);

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is undefined", async () => {
      manufacturer.email = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is less than 5 characters", async () => {
      manufacturer.email = new Array(3).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is more than 255 characters", async () => {
      manufacturer.email = new Array(257).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
      manufacturer.email = new Array(10).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    xit("should return 400 if email is not unique", async () => {
      const oldManufacturer = { ...seed_manufactureres[1] };
      oldManufacturer.email = manufacturer.email;
      await Manufacturer.collection.insertOne(oldManufacturer);

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the manufacturer if it is valid", async () => {
      await exec();

      const res = await Manufacturer.findOne({ email: manufacturer.email });

      expect(res).toBeDefined();
      expect(res).toMatchObject(manufacturer);
    });

    it("should return the manufacturer if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(manufacturer);
    });
  });

  describe("PUT /:id", () => {
    let token: string;
    let newName: any;
    let newEmail: any;
    let newMobile: any;
    let newAddress: any;
    let id: any;
    let oldManufacturer: any;

    const exec = async () => {
      return request(server)
        .put(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send({
          name: newName,
          email: newEmail,
          mobile: newMobile,
          address: newAddress,
        });
    };

    beforeEach(async () => {
      await Manufacturer.collection.insertOne(seed_manufactureres[0]);
      oldManufacturer = { ...seed_manufactureres[1] };

      let user: any = new User();
      token = user.generateAuthToken();
      id = seed_manufactureres[0]._id;
      newName = "updatedName";
      newEmail = "newmail@c.com";
      newMobile = "0987654321";
      newAddress = "new address";
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if name is undefined", async () => {
      newName = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is less than 5 characters", async () => {
      newName = "m";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is more than 50 characters", async () => {
      newName = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is undefined", async () => {
      newMobile = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is less than 10 characters", async () => {
      newMobile = new Array(5).join("1");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is more than 50 characters", async () => {
      newMobile = new Array(52).join("1");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is invalid", async () => {
      newMobile = new Array(5).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    xit("should return 400 if mobile is not unique", async () => {
      await Manufacturer.collection.insertOne(oldManufacturer);
      newMobile = oldManufacturer.mobile;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if address is undefined", async () => {
      newAddress = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is less than 5 characters", async () => {
      newAddress = "m";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is more than 255 characters", async () => {
      newAddress = new Array(257).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    xit("should return 400 if address is not unique", async () => {
      await Manufacturer.collection.insertOne(oldManufacturer);
      newAddress = oldManufacturer.address;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is undefined", async () => {
      newEmail = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is less than 5 characters", async () => {
      newEmail = new Array(3).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is more than 255 characters", async () => {
      newEmail = new Array(257).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
      newEmail = new Array(10).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    xit("should return 400 if email is not unique", async () => {
      await Manufacturer.collection.insertOne(oldManufacturer);
      newEmail = oldManufacturer.email;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 when id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if manufacturer with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should update the manufacturer if input is valid", async () => {
      await exec();

      const manufacturerInDB = await Manufacturer.findOne({ email: newEmail });

      expect(manufacturerInDB).toMatchObject({
        name: newName,
        email: newEmail,
        mobile: newMobile,
        address: newAddress,
      });
    });

    it("should return the updated manufacturer if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: newName,
        email: newEmail,
        mobile: newMobile,
        address: newAddress,
      });
    });
  });

  describe("DELETE /:id", () => {
    let token: string;
    let id: any;

    const exec = async () => {
      return await request(server)
        .delete(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      await Manufacturer.collection.insertOne(seed_manufactureres[0]);
      id = seed_manufactureres[0]._id;

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

    it("should return 404 if manufacturer with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should delete the manufacturer if input is valid", async () => {
      await exec();

      const manufacturerInDB = await Manufacturer.findById(id);

      expect(manufacturerInDB).toBeNull();
    });

    it("should return the removed manufacturer", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(seed_manufactureres[0]);
    });
  });
});
