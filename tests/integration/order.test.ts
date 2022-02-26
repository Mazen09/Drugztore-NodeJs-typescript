import { Server } from "http";
import { server } from "../../index";
import { Manufacturer } from "../../models/manufacturer";
import { Category } from "../../models/category";
import { Product } from "../../models/product";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";
import { Order } from "../../models/order";
import { seed_orders, seed_users } from "../../seeding/data";
import { orderStatus } from "../../utils/utils";

const endpoint: string = "/api/orders";

jest.useFakeTimers("legacy");

describe(endpoint, () => {
  let s: Server;
  let token: any;

  beforeEach(async () => {
    s = server;
    let user: any = new User({ isAdmin: true });
    token = user.generateAuthToken();
  });

  afterEach(async () => {
    await s.close();
    await Order.remove({});
    await Product.remove({});
    await Category.remove({});
    await Manufacturer.remove({});
  });

  describe("GET /", () => {
    const exec = async () => {
      return request(s).get(endpoint).set("x-auth-token", token).send();
    };

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return logged in user orders if user not admin", async () => {
      await Order.collection.insertMany([seed_orders[0], seed_orders[1]]);
      const user: any = new User({
        _id: seed_orders[0].user._id,
        isAdmin: false,
      });
      token = user.generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toMatchObject(seed_orders[0]);
    });

    it("should return all orders if user is admin", async () => {
      await Order.collection.insertMany([seed_orders[0], seed_orders[1]]);

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body).toMatchObject([seed_orders[0], seed_orders[1]]);
    });
  });

  describe("GET /:id", () => {
    let id: any;

    beforeEach(() => {
      id = seed_orders[0]._id;
    });
    const exec = async () => {
      return request(s)
        .get(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send();
    };

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 when id is not in collection", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if user is not admin and order doesn't belong to him", async () => {
      await Order.collection.insertOne(seed_orders[0]);
      const user: any = new User({
        _id: seed_users[1]._id,
        isAdmin: false,
      });
      token = user.generateAuthToken();

      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return the order if user is not admin and order belongs to him", async () => {
      await Order.collection.insertOne(seed_orders[0]);
      const user: any = new User({
        _id: seed_orders[0].user._id,
        isAdmin: false,
      });
      token = user.generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(seed_orders[0]);
    });

    it("should return the order if user is admin", async () => {
      await Order.collection.insertOne(seed_orders[0]);

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(seed_orders[0]);
    });
  });

  describe("POST /", () => {
    let order: any;
    let items: any;
    let userId: any;

    beforeEach(async () => {
      order = { ...seed_orders[0] };
      userId = seed_orders[0].user._id;
      items = [
        {
          productId: seed_orders[0].items[0].product._id,
          amount: seed_orders[0].items[0].amount,
        },
        {
          productId: seed_orders[1].items[1].product._id,
          amount: seed_orders[1].items[1].amount,
        },
      ]
    });
    
    afterEach(async () => {
      await Order.remove({});
      await Product.remove({});
      await Category.remove({});
      await Manufacturer.remove({});
    });

    const exec = async () => {
      return request(s)
        .post(endpoint)
        .set("x-auth-token", token)
        .send({
          userId: userId,
          items: items,
        });
    };

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if userId is undefined", async () => {
      userId = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if userId is invalid object id", async () => {
      userId = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if items is undefined", async () => {
      items = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if items is empty", async () => {
      items = [];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if items is empty", async () => {
      items = [];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if product id is undefined", async () => {
      items = [
        {
          productId: undefined,
          amount: 10,
        },
      ];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if product id is invalid", async () => {
      items = [
        {
          productId: 1,
          amount: 10,
        },
      ];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if product amount is undefined", async () => {
      items = [
        {
          productId: order.items[0].product._id,
          amount: undefined,
        },
      ];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if product amount is less than 1", async () => {
      order.items = [
        {
          productId: seed_orders[0].items[0].product._id,
          amount: 0,
        },
      ];
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /:id", () => {
    let id: any;
    let newStatus: any;

    beforeEach(async () => {
      await Order.collection.insertOne(seed_orders[0]);
      id = seed_orders[0]._id;
      newStatus = orderStatus.Processed;
    });

    const exec = async () => {
      return await request(s)
        .put(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send({ status: newStatus });
    };

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if order status is undefined", async () => {
      newStatus = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if order status is invalid", async () => {
      newStatus = "invalid status";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if user is not admin and order doesn't belong to him", async () => {
      const user: any = new User({
        _id: seed_users[1]._id,
        isAdmin: false,
      });
      token = user.generateAuthToken();

      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should update the order status if new status is valid", async () => {
      await exec();

      const orderInDB = await Order.findById(id);

      expect(orderInDB).toBeDefined();
      expect(orderInDB).toHaveProperty("status", newStatus);
    });

    it("should return the updated order if new status is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", newStatus);
    });
  });

  describe("DETETE /:id", () => {
    let id: any;

    const exec = async () => {
      return await request(server)
        .delete(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      await Order.collection.insertOne(seed_orders[0]);

      id = seed_orders[0]._id;
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

    it("should return 404 if order with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should delete the order if input is valid", async () => {
      await exec();

      const orderInDB = await Order.findById(id);

      expect(orderInDB).toBeNull();
    });

    it("should return the removed order", async () => {
      const res = await exec();

      expect(res.body).toMatchObject(seed_orders[0]);
    });
  });
});
