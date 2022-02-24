import { Server } from "http";
import { server } from "../../index";
import { Manufacturer } from "../../models/manufacturer";
import { Category } from "../../models/category";
import { Product } from "../../models/product";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";

jest.useFakeTimers();

const endpoint: string = "/api/products";

describe(endpoint, () => {
  let s: Server;
  let category: any;
  let manufacturer: any;

  beforeEach(async () => {
    s = server;

    category = new Category({ name: "category 1" });
    manufacturer = new Manufacturer({
      name: "name 1",
      email: "a@b.com",
      mobile: "1234567890",
      address: "some address",
    });
    await category.save();
    await manufacturer.save();
  });

  afterEach(async () => {
    await s.close();
    await Product.remove({});
    await Category.remove({});
    await Manufacturer.remove({});
  });

  xdescribe("GET /", () => {
    it("should return all products", async () => {
      const ps = [
        {
          name: "prduct1",
          manufacturer: {
            _id: manufacturer._id,
            name: manufacturer.name,
            email: manufacturer.email,
          },
          numberInStock: 120,
          category: {
            _id: category._id,
            name: category.name,
          },
          price: 100,
          description: new Array(100).join("a"),
          activeIngredients: ["aaaaa", "bbbbb"],
        },
        {
          name: "prduct2",
          manufacturer: {
            _id: manufacturer._id,
            name: manufacturer.name,
            email: manufacturer.email,
          },
          numberInStock: 120,
          category: {
            _id: category._id,
            name: category.name,
          },
          price: 100,
          description: new Array(100).join("a"),
          activeIngredients: ["aaaaa", "bbbbb"],
        },
      ];
      await Product.collection.insertMany(ps);

      const res = await request(s).get(`${endpoint}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toMatchObject(ps[0]);
      expect(res.body[1]).toMatchObject(ps[1]);
    });
  });

  xdescribe("GET /:id", () => {
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
      const p = {
        name: "prduct1",
        manufacturer: {
          _id: manufacturer._id,
          name: manufacturer.name,
          email: manufacturer.email,
        },
        numberInStock: 120,
        category: {
          _id: category._id,
          name: category.name,
        },
        price: 100,
        description: new Array(100).join("a"),
        activeIngredients: ["aaaaa", "bbbbb"],
      };
      const product = await Product.collection.insertOne(p);

      const res = await request(s).get(`${endpoint}/${product.insertedId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", product.insertedId.toHexString());
      expect(res.body).toMatchObject(p);
    });
  });

  xdescribe("POST /", () => {
    let name: any;
    let manufacturerId: any;
    let categoryId: any;
    let numberInStock: any;
    let rate: any;
    let price: any;
    let activeIngredients: any;
    let description: any;
    let images: any;
    let token: any;

    const exec = async () => {
      return await request(s).post(endpoint).set("x-auth-token", token).send({
        name,
        manufacturerId,
        categoryId,
        numberInStock,
        price,
        description,
        activeIngredients,
        rate,
        images,
      });
    };

    beforeEach(() => {
      name = "product1";
      manufacturerId = manufacturer._id;
      categoryId = category._id;
      numberInStock = 100;
      price = 100;
      description = new Array(100).join("a");
      activeIngredients = ["aaaaa", "bbbbb"];
      rate = 1.5;
      images = [];
      const user: any = new User();
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

    it("should return 400 if manufacturerId is undefined", async () => {
      manufacturerId = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if manufacturerId is invalid", async () => {
      manufacturerId = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if manufacturer doesn't exist", async () => {
      manufacturerId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if categoryId is undefined", async () => {
      categoryId = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if categoryId is invalid", async () => {
      categoryId = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if category doesn't exist", async () => {
      categoryId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if numberInStock is undefined", async () => {
      numberInStock = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is less than 0", async () => {
      numberInStock = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is more than 500", async () => {
      numberInStock = 501;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is undefined", async () => {
      price = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is less than 0", async () => {
      price = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is more than 10000", async () => {
      price = 10001;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is undefined", async () => {
      description = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is less than 50 characters", async () => {
      description = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is more than 500 characters", async () => {
      description = new Array(502).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredients is undefined", async () => {
      activeIngredients = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredients is empty list", async () => {
      activeIngredients = [];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredient is less than 5 characters", async () => {
      activeIngredients = ["a"];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredient is more than 50 characters", async () => {
      activeIngredients = [new Array(52).join("a")];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if rate is less than 0", async () => {
      rate = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if rate is more than 5", async () => {
      rate = 5.1;
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
      await exec();

      const product = await Product.findOne({ name });

      expect(product).toBeDefined();
      expect(product).toMatchObject({
        name,
        numberInStock,
        price,
        description,
        activeIngredients,
        rate,
        images,
      });
      expect(product?.manufacturer).toMatchObject({
        _id: manufacturer._id,
        name: manufacturer.name,
        email: manufacturer.email,
      });

      expect(product?.category).toMatchObject({
        _id: category._id,
        name: category.name,
      });
    });

    it("should return saved product", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toMatchObject({
        name,
        numberInStock,
        price,
        description,
        activeIngredients,
        rate,
        images,
      });
      expect(res.body?.manufacturer).toMatchObject({
        _id: manufacturer._id.toHexString(),
        name: manufacturer.name,
        email: manufacturer.email,
      });

      expect(res.body?.category).toMatchObject({
        _id: category._id.toHexString(),
        name: category.name,
      });
    });
  });

  xdescribe("PUT /:id", () => {
    let name: any;
    let manufacturerId: any;
    let categoryId: any;
    let numberInStock: any;
    let rate: any;
    let price: any;
    let activeIngredients: any;
    let description: any;
    let images: any;
    let token: any;
    let id: any;
    let newManufacturer: any;
    let newCatgegory: any;
    let product: any;

    const exec = async () => {
      return await request(s)
        .put(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send({
          name,
          manufacturerId,
          categoryId,
          numberInStock,
          price,
          description,
          activeIngredients,
          rate,
          images,
        });
    };

    beforeEach(async () => {
      newManufacturer = new Manufacturer({
        name: "new man 1",
        email: "y@z.com",
        mobile: "1234567899",
        address: "some new address",
      });
      newCatgegory = new Category({ name: "new category" });
      product = new Product({
        name: "product1",
        manufacturer: {
          _id: manufacturer._id,
          name: manufacturer.name,
          email: manufacturer.email,
        },
        category: {
          _id: category._id,
          name: category.name,
        },
        numberInStock: 10,
        price: 100,
        description: new Array(101).join("a"),
        activeIngredients: ["aaaaa"],
        rate: 1,
        images: [],
      });

      let user: any = new User();

      await newManufacturer.save();
      await newCatgegory.save();
      await product.save();

      id = product._id;
      token = user.generateAuthToken();
      name = "new product";
      manufacturerId = newManufacturer._id;
      categoryId = newCatgegory._id;
      numberInStock = 11;
      price = 120;
      description = new Array(201).join("b");
      activeIngredients = ["bbbbb", "ccccc"];
      rate = 5;
      images = [];
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

    it("should return 400 if manufacturerId is undefined", async () => {
      manufacturerId = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if manufacturerId is invalid", async () => {
      manufacturerId = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if manufacturer doesn't exist", async () => {
      manufacturerId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if categoryId is undefined", async () => {
      categoryId = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if categoryId is invalid", async () => {
      categoryId = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if category doesn't exist", async () => {
      categoryId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if numberInStock is undefined", async () => {
      numberInStock = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is less than 0", async () => {
      numberInStock = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is more than 500", async () => {
      numberInStock = 501;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is undefined", async () => {
      price = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is less than 0", async () => {
      price = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if price is more than 10000", async () => {
      price = 10001;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is undefined", async () => {
      description = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is less than 50 characters", async () => {
      description = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if description is more than 500 characters", async () => {
      description = new Array(502).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredients is undefined", async () => {
      activeIngredients = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredients is empty list", async () => {
      activeIngredients = [];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredient is less than 5 characters", async () => {
      activeIngredients = ["a"];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if activeIngredient is more than 50 characters", async () => {
      activeIngredients = [new Array(52).join("a")];
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if rate is less than 0", async () => {
      rate = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if rate is more than 5", async () => {
      rate = 5.1;
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

    it("should update the product if it's valid", async () => {
      await exec();

      const productInDB = await Product.findOne({ description });

      expect(productInDB).toBeDefined();
      expect(productInDB).toMatchObject({
        name,
        numberInStock,
        price,
        description,
        activeIngredients,
        rate,
        images,
      });
      expect(productInDB?.manufacturer).toMatchObject({
        _id: newManufacturer._id,
        name: newManufacturer.name,
        email: newManufacturer.email,
      });

      expect(productInDB?.category).toMatchObject({
        _id: newCatgegory._id,
        name: newCatgegory.name,
      });
    });

    it("should return saved product", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toMatchObject({
        name,
        numberInStock,
        price,
        description,
        activeIngredients,
        rate,
        images,
      });
      expect(res.body?.manufacturer).toMatchObject({
        _id: newManufacturer._id,
        name: newManufacturer.name,
        email: newManufacturer.email,
      });

      expect(res.body?.category).toMatchObject({
        _id: newCatgegory._id,
        name: newCatgegory.name,
      });
    });
  });

  xdescribe("DETETE /:id", () => {
    let token: string;
    let product: any;
    let id: any;

    const exec = async () => {
      return await request(server)
        .delete(`${endpoint}/${id}`)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      product = new Product({
        name: "prduct1",
        manufacturer: {
          _id: manufacturer._id,
          name: manufacturer.name,
          email: manufacturer.email,
        },
        numberInStock: 120,
        category: {
          _id: category._id,
          name: category.name,
        },
        price: 100,
        description: new Array(100).join("a"),
        activeIngredients: ["aaaaa", "bbbbb"],
      });
      await product.save();

      id = product._id;
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

      expect(res.body).toMatchObject({
        name: "prduct1",
        numberInStock: 120,
        price: 100,
        description: new Array(100).join("a"),
        activeIngredients: ["aaaaa", "bbbbb"],
        rate: 0,
        images: [],
      });
      expect(res.body?.manufacturer).toMatchObject({
        _id: manufacturer._id,
        name: manufacturer.name,
        email: manufacturer.email,
      });

      expect(res.body?.category).toMatchObject({
        _id: category._id,
        name: category.name,
      });
    });
  });
});
