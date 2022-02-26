import { Server } from "http";
import { server } from "../../index";
import { Manufacturer } from "../../models/manufacturer";
import { Category } from "../../models/category";
import { Product } from "../../models/product";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";
import {
  seed_categories,
  seed_manufactureres,
  seed_products,
} from "../../seeding/data";

jest.useFakeTimers("legacy");

const endpoint: string = "/api/products";

describe(endpoint, () => {
  let s: Server;

  beforeEach(async () => {
    s = server;
  });

  afterEach(async () => {
    await s.close();
    await Product.deleteMany({});
    await Manufacturer.deleteMany({});
    await Category.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all products", async () => {
      await Product.collection.insertMany([seed_products[0], seed_products[1]]);

      const res = await request(s).get(`${endpoint}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toMatchObject(seed_products[0]);
      expect(res.body[1]).toMatchObject(seed_products[1]);
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

    it("should return product with given id", async () => {
      await Product.collection.insertOne(seed_products[0]);

      const res = await request(s).get(`${endpoint}/${seed_products[0]._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(seed_products[0]);
    });
  });

  describe("POST /", () => {
    let product: any;
    let images: any;
    let token: any;

    afterEach(async () => {
      await Product.deleteMany({});
      await Manufacturer.deleteMany({});
      await Category.deleteMany({});
    });

    beforeEach(async () => {
      product = { ...seed_products[0] };
      product.manufacturer._id = seed_manufactureres[0]._id;
      product.category._id = seed_categories[0]._id
      product.name = "test post product";
      images = [];
      const user: any = new User();
      token = user.generateAuthToken();
    });

    const exec = async () => {
      return request(s).post(endpoint).set("x-auth-token", token).send({
        name: product.name,
        manufacturerId: product.manufacturer._id,
        categoryId: product.category._id,
        numberInStock: product.numberInStock,
        price: product.price,
        description: product.description,
        activeIngredients: product.activeIngredients,
        rate: product.rate,
        images: images,
      });
    };

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if name is undefined", async () => {
      product.name = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is less than 5 characters", async () => {
      product.name = "m";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if name is more than 50 characters", async () => {
      product.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if manufacturerId is undefined", async () => {
      product.manufacturer._id = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if manufacturerId is invalid", async () => {
      product.manufacturer._id = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if manufacturer doesn't exist", async () => {
      product.manufacturer._id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if categoryId is undefined", async () => {
      product.category._id = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if categoryId is invalid", async () => {
      product.category._id = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if category doesn't exist", async () => {
      product.category._id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if numberInStock is undefined", async () => {
      product.numberInStock = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is less than 0", async () => {
      product.numberInStock = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is more than 500", async () => {
      product.numberInStock = 501;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is undefined", async () => {
      product.price = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is less than 0", async () => {
      product.price = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is more than 10000", async () => {
      product.price = 10001;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is undefined", async () => {
      product.description = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is less than 50 characters", async () => {
      product.description = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is more than 500 characters", async () => {
      product.description = new Array(502).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredients is undefined", async () => {
      product.activeIngredients = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredients is empty list", async () => {
      product.activeIngredients = [];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredient is less than 5 characters", async () => {
      product.activeIngredients = ["a"];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredient is more than 50 characters", async () => {
      product.activeIngredients = [new Array(52).join("a")];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if rate is less than 0", async () => {
      product.rate = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if rate is more than 5", async () => {
      product.rate = 5.1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if imageId is invalid", async () => {
      images = [1];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if image doesn't exist", async () => {
      images = [new mongoose.Types.ObjectId()];
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should save the product if it's valid", async () => {
      await Manufacturer.collection.insertOne(seed_manufactureres[0]);
      await Category.collection.insertOne(seed_categories[0]);
      await exec();

      const res = await Product.findOne({ name: "test post product" });

      expect(res).toBeDefined();
      expect(res).toMatchObject(product);
    });

    it("should return saved product", async () => {
      await Manufacturer.collection.insertOne(seed_manufactureres[0]);
      await Category.collection.insertOne(seed_categories[0]);
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(product);
    });
  });

  describe("PUT /:id", () => {
    let newName: any;
    let newNumberInStock: any;
    let newRate: any;
    let newPrice: any;
    let newActiveIngredients: any;
    let newDescription: any;
    let newImages: any;
    let token: any;
    let id: any;
    let newManufacturer: any;
    let newCategory: any;

    const exec = async () => {
      return await request(s)
        .put(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send({
          name: newName,
          manufacturerId: newManufacturer._id,
          categoryId: newCategory._id,
          numberInStock: newNumberInStock,
          price: newPrice,
          description: newDescription,
          activeIngredients: newActiveIngredients,
          rate: newRate,
          images: newImages,
        });
    };

    afterEach(async () => {
      await Product.deleteMany({});
      await Manufacturer.deleteMany({});
      await Category.deleteMany({});
    });

    beforeEach(async () => {
      await Product.collection.insertOne(seed_products[0]);
      id = seed_products[0]._id;

      let user: any = new User();
      token = user.generateAuthToken();

      newName = "new product";
      newManufacturer = seed_manufactureres[1];
      newCategory = seed_categories[1];
      newNumberInStock = 101;
      newPrice = 16;
      newDescription = new Array(201).join("b");
      newActiveIngredients = ["bbbbb", "ccccc"];
      newRate = 5;
      newImages = [];
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 when id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if product with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
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

    it("should return 400 if manufacturerId is undefined", async () => {
      newManufacturer._id = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if manufacturerId is invalid", async () => {
      newManufacturer._id = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if manufacturer doesn't exist", async () => {
      newManufacturer._id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if categoryId is undefined", async () => {
      newCategory._id = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if categoryId is invalid", async () => {
      newCategory._id = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if category doesn't exist", async () => {
      newCategory._id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if numberInStock is undefined", async () => {
      newNumberInStock = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is less than 0", async () => {
      newNumberInStock = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is more than 500", async () => {
      newNumberInStock = 501;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is undefined", async () => {
      newPrice = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is less than 0", async () => {
      newPrice = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is more than 10000", async () => {
      newPrice = 10001;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is undefined", async () => {
      newDescription = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is less than 50 characters", async () => {
      newDescription = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is more than 500 characters", async () => {
      newDescription = new Array(502).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredients is undefined", async () => {
      newActiveIngredients = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredients is empty list", async () => {
      newActiveIngredients = [];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredient is less than 5 characters", async () => {
      newActiveIngredients = ["a"];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredient is more than 50 characters", async () => {
      newActiveIngredients = [new Array(52).join("a")];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if rate is less than 0", async () => {
      newRate = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if rate is more than 5", async () => {
      newRate = 5.1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if imageId is invalid", async () => {
      newImages = [1];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if image doesn't exist", async () => {
      newImages = [new mongoose.Types.ObjectId()];
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should update the product if it's valid", async () => {
      await Manufacturer.collection.insertOne(seed_manufactureres[1]);
      await Category.collection.insertOne(seed_categories[1]);
      await exec();

      const productInDB = await Product.findById(id);

      expect(productInDB).toBeDefined();
      expect(productInDB).toMatchObject({
        name: newName,
        numberInStock: newNumberInStock,
        price: newPrice,
        description: newDescription,
        activeIngredients: newActiveIngredients,
        rate: newRate,
        images: newImages,
        manufacturer: {
          _id: newManufacturer._id,
          name: newManufacturer.name,
          email: newManufacturer.email,
        },
        category: newCategory,
      });
    });

    it("should return updated product", async () => {
      await Manufacturer.collection.insertOne(seed_manufactureres[1]);
      await Category.collection.insertOne(seed_categories[1]);
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: newName,
        numberInStock: newNumberInStock,
        price: newPrice,
        description: newDescription,
        activeIngredients: newActiveIngredients,
        rate: newRate,
        images: newImages,
        manufacturer: {
          _id: newManufacturer._id,
          name: newManufacturer.name,
          email: newManufacturer.email,
        },
        category: newCategory,
      });
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
      await Product.collection.insertOne(seed_products[0]);

      id = seed_products[0]._id;
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

    it("should return 404 if product with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should delete the product if input is valid", async () => {
      await exec();

      const productInDB = await Product.findById(id);

      expect(productInDB).toBeNull();
    });

    it("should return the removed product", async () => {
      const res = await exec();

      expect(res.body).toMatchObject(seed_products[0]);
    });
  });
});
