import { Category } from "../models/category";
import { Manufacturer } from "../models/manufacturer";
import { Order } from "../models/order";
import { Product } from "../models/product";
import { User } from "../models/user";
import mongoose from "mongoose";
import { setupDB } from "../startup/db";

async function populateDb() {
  setupDB();

  const user1_id = new mongoose.Types.ObjectId();
  const user2_id = new mongoose.Types.ObjectId();
  const user3_id = new mongoose.Types.ObjectId();
  const user4_id = new mongoose.Types.ObjectId();
  const user5_id = new mongoose.Types.ObjectId();

  await User.collection.insertMany([
    {
      _id: user1_id,
      name: "user1",
      email: "a@a.com",
      password: "1234567890",
      isAdmin: true,
    },
    {
      _id: user2_id,
      name: "user2",
      email: "b@a.com",
      password: "1234567890",
      isAdmin: true,
    },
    {
      _id: user3_id,
      name: "user3",
      email: "c@a.com",
      password: "1234567890",
      isAdmin: true,
    },
    {
      _id: user4_id,
      name: "user4",
      email: "d@a.com",
      password: "1234567890",
      isAdmin: false,
    },
    {
      _id: user5_id,
      name: "user5",
      email: "e@a.com",
      password: "1234567890",
      isAdmin: false,
    },
  ]);

  const category1_id = new mongoose.Types.ObjectId();
  const category2_id = new mongoose.Types.ObjectId();
  const category3_id = new mongoose.Types.ObjectId();
  const category4_id = new mongoose.Types.ObjectId();
  const category5_id = new mongoose.Types.ObjectId();

  await Category.collection.insertMany([
    { _id: category1_id, name: "category1" },
    { _id: category2_id, name: "category2" },
    { _id: category3_id, name: "category3" },
    { _id: category4_id, name: "category4" },
    { _id: category5_id, name: "category5" },
  ]);

  const man1_id = new mongoose.Types.ObjectId();
  const man2_id = new mongoose.Types.ObjectId();
  const man3_id = new mongoose.Types.ObjectId();
  const man4_id = new mongoose.Types.ObjectId();
  const man5_id = new mongoose.Types.ObjectId();

  await Manufacturer.collection.insertMany([
    {
      _id: man1_id,
      name: "manufacturer1",
      email: "a@a.com",
      address: "address1",
      mobile: "1234567890",
    },
    {
      _id: man2_id,
      name: "manufacturer2",
      email: "b@a.com",
      address: "address2",
      mobile: "1234567891",
    },
    {
      _id: man3_id,
      name: "manufacturer3",
      email: "c@a.com",
      address: "address3",
      mobile: "1234567892",
    },
    {
      _id: man4_id,
      name: "manufacturer4",
      email: "d@a.com",
      address: "address4",
      mobile: "1234567893",
    },
    {
      _id: man5_id,
      name: "manufacturer5",
      email: "e@a.com",
      address: "address5",
      mobile: "1234567894",
    },
  ]);

  const product1_id = new mongoose.Types.ObjectId();
  const product2_id = new mongoose.Types.ObjectId();
  const product3_id = new mongoose.Types.ObjectId();
  const product4_id = new mongoose.Types.ObjectId();
  const product5_id = new mongoose.Types.ObjectId();

  await Product.collection.insertMany([
    {
      _id: product1_id,
      name: "product1",
      manufacturer: { _id: man1_id, name: "manufacturer1", email: "a@a.com" },
      category: { _id: category1_id, name: "category1" },
      numberInStock: 100,
      price: 15,
      description: new Array(100).join("a"),
      activeIngredients: ["aaaaa", "bbbbb"],
    },
    {
      _id: product2_id,
      name: "product2",
      manufacturer: { _id: man2_id, name: "manufacturer2", email: "b@a.com" },
      category: { _id: category2_id, name: "category2" },
      numberInStock: 100,
      price: 15,
      description: new Array(100).join("a"),
      activeIngredients: ["aaaaa", "bbbbb"],
    },
    {
      _id: product3_id,
      name: "product3",
      manufacturer: { _id: man3_id, name: "manufacturer3", email: "c@a.com" },
      category: { _id: category3_id, name: "category3" },
      numberInStock: 100,
      price: 15,
      description: new Array(100).join("a"),
      activeIngredients: ["aaaaa", "bbbbb"],
    },
    {
      _id: product4_id,
      name: "product4",
      manufacturer: { _id: man4_id, name: "manufacturer4", email: "d@a.com" },
      category: { _id: category4_id, name: "category4" },
      numberInStock: 100,
      price: 15,
      description: new Array(100).join("a"),
      activeIngredients: ["aaaaa", "bbbbb"],
    },
    {
      _id: product5_id,
      name: "product5",
      manufacturer: { _id: man5_id, name: "manufacturer5", email: "a@a.com" },
      category: { _id: category5_id, name: "category5" },
      numberInStock: 100,
      price: 15,
      description: new Array(100).join("a"),
      activeIngredients: ["aaaaa", "bbbbb"],
    },
  ]);

  const order1_id = new mongoose.Types.ObjectId();
  const order2_id = new mongoose.Types.ObjectId();
  const order3_id = new mongoose.Types.ObjectId();
  const order4_id = new mongoose.Types.ObjectId();
  const order5_id = new mongoose.Types.ObjectId();

  //   await Order.collection.insertMany([
  //       {}
  //   ])

  console.log('seeding completed :)');
  process.exit(0);
}

populateDb();
