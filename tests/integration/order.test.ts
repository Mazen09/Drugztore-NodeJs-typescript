import { Server } from "http";
import { server } from "../../index";
import { Manufacturer } from "../../models/manufacturer";
import { Category } from "../../models/category";
import { Product } from "../../models/product";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";
import { Order } from "../../models/order";

const endpoint: string = "/api/orders";

describe(endpoint, () => {
  let s: Server;
  let category: any;
  let manufacturer: any;
  let product1: any;
  let product2: any;
  let user1: any;
  let user2: any;
  let token1: any;
  let token2: any;
  let order1: any;
  let order2: any;

  beforeEach(async () => {
    s = server;
    category = new Category({ name: "category 1" });
    manufacturer = new Manufacturer({
      name: "name 1",
      email: "a@b.com",
      mobile: "1234567890",
      address: "some address",
    });
    user1 = new User({
      name: "user1",
      email: "user1@gmail.com",
      password: "123456789",
    });
    user2 = new User({
      name: "user2",
      email: "user2@gmail.com",
      password: "123456789",
    });
    await category.save();
    await manufacturer.save();
    await user1.save();
    await user2.save();
    token1 = user1.generateAuthToken();
    token2 = user2.generateAuthToken();

    product1 = new Product({
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

    product2 = new Product({
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
    });

    await product1.save();
    await product2.save();
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
      return request(s).get(endpoint).set("x-auth-token", token1).send();
    };

    beforeEach(async () => {
      order1 = new Order({
        user: {
          _id: user1._id,
          name: user1.name,
          email: user1.email,
        },
        items: [
          {
            product: {
              name: product1.name,
              price: product1.price,
            },
            amount: 1
          },
        ],
        
      });
    });
  });
});
