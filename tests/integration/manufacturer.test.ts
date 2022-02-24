import { Server } from "http";
import { server } from "../../index";
import { Manufacturer } from "../../models/manufacturer";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";

const endpoint: string = "/api/manufactureres";

jest.useFakeTimers("legacy");

describe(`${endpoint}`, () => {
  let s: Server;

  beforeEach(async () => {
    s = server;
  });

  afterEach(async () => {
    await s.close();
    await Manufacturer.remove({});
  });

  describe("GET /", () => {
    it("should return all manufactureres", async () => {
      await Manufacturer.collection.insertMany([
        {
          name: "man 1",
          email: "a@b.com",
          mobile: "1234567890",
          address: "abcde123",
        },
        {
          name: "man 2",
          email: "a@c.com",
          mobile: "1234567891",
          address: "abcde1223",
        },
      ]);

      const res = await request(s).get(`${endpoint}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some(
          (g: any) =>
            g.name == "man 1" &&
            g.email == "a@b.com" &&
            g.mobile == "1234567890" &&
            g.address == "abcde123"
        )
      ).toBeTruthy();
      expect(
        res.body.some(
          (g: any) =>
            g.name == "man 2" &&
            g.email == "a@c.com" &&
            g.mobile == "1234567891" &&
            g.address == "abcde1223"
        )
      ).toBeTruthy();
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
      const manufacturer = await Manufacturer.collection.insertOne({
        name: "man 1",
        email: "a@b.com",
        mobile: "1234567890",
        address: "abcde123",
      });

      const res = await request(s).get(
        `${endpoint}/${manufacturer.insertedId}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        _id: manufacturer.insertedId,
        name: "man 1",
        email: "a@b.com",
        mobile: "1234567890",
        address: "abcde123",
      });
    });
  });

  describe("POST /", () => {
    let name: any;
    let email: any;
    let mobile: any;
    let address: any;
    let token: string;

    const exec = async () => {
      return await request(s)
        .post(endpoint)
        .set("x-auth-token", token)
        .send({ name, email, mobile, address });
    };

    beforeEach(() => {
      const user: any = new User();
      name = "man 1";
      email = "a@b.com";
      mobile = "1234567890";
      address = "abcdef";
      token = user.generateAuthToken();
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if name is undefined", async () => {
      name = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is less than 5 characters", async () => {
      name = "m";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is undefined", async () => {
      mobile = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is less than 10 characters", async () => {
      mobile = new Array(5).join("1");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is more than 50 characters", async () => {
      mobile = new Array(52).join("1");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is not unique", async () => {
      await Manufacturer.collection.insertOne({
        name: "man 1",
        email: "z@z.com",
        mobile: mobile,
        address: "unique address",
      });
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if mobile is invalid", async () => {
      mobile = new Array(5).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is undefined", async () => {
      address = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is less than 5 characters", async () => {
      address = "m";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is more than 255 characters", async () => {
      address = new Array(257).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if address is not unique", async () => {
      await Manufacturer.collection.insertOne({
        name: "man 1",
        email: "z@z.com",
        mobile: "1234567899",
        address: address,
      });
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is undefined", async () => {
      email = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is less than 5 characters", async () => {
      email = new Array(3).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is more than 255 characters", async () => {
      email = new Array(257).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
      email = new Array(10).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if email is not unique", async () => {
      await Manufacturer.collection.insertOne({
        name: "man 1",
        email: email,
        mobile: "1234567899",
        address: "unique address",
      });

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the manufacturer if it is valid", async () => {
      await exec();

      const manufacturer = await Manufacturer.findOne({ email });

      expect(manufacturer).toBeDefined();
      expect(manufacturer).toMatchObject({ name, email, mobile, address });
    });

    it("should return the manufacturer if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toMatchObject({ name, email, mobile, address });
    });
  });

  describe("PUT /:id", () => {
    let token: string;
    let newName: any;
    let newEmail: any;
    let newMobile: any;
    let newAddress: any;
    let manufacturer: any;
    let id: any;

    const exec = async () => {
      return await request(server)
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
      manufacturer = new Manufacturer({
        name: "name 1",
        email: "a@b.com",
        mobile: "1234567890",
        address: "some address",
      });
      await manufacturer.save();

      let user: any = new User();
      token = user.generateAuthToken();
      id = manufacturer._id;
      newName = "updatedName";
      newEmail = "b@c.com";
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

    it("should return 400 if mobile is not unique", async () => {
      const oldMobile = "0000000000";
      await Manufacturer.collection.insertOne({
        name: "old manufacturer",
        email: "b@b.com",
        mobile: oldMobile,
        address: "abcde000",
      });
      newMobile = oldMobile;

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

    it("should return 400 if address is not unique", async () => {
      const oldAddress = "old address";
      await Manufacturer.collection.insertOne({
        name: "old manufacturer",
        email: "b@b.com",
        mobile: "1235214785",
        address: oldAddress,
      });
      newAddress = oldAddress;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is undefined", async () => {
      newEmail = new Array(3).join("a");
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

    it("should return 400 if email is not unique", async () => {
      const oldEmail = "old@email.com";
      await Manufacturer.collection.insertOne({
        name: "old manufacturer",
        email: oldEmail,
        mobile: "1235214785",
        address: "old address",
      });
      newEmail = oldEmail;

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
    let manufacturer: any;
    let id: any;

    const exec = async () => {
      return await request(server)
        .delete(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      manufacturer = new Manufacturer({
        name: "man 1",
        email: "a@b.com",
        mobile: "1234567890",
        address: "abcde123",
      });
      await manufacturer.save();

      id = manufacturer._id;
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
      expect(res.body).toHaveProperty("_id", id.toHexString());
      expect(res.body).toMatchObject({
        name: "man 1",
        email: "a@b.com",
        mobile: "1234567890",
        address: "abcde123",
      });
    });
  });
});
