import { Category } from "../models/category";
import { Manufacturer } from "../models/manufacturer";
import { Order } from "../models/order";
import { Product } from "../models/product";
import { User } from "../models/user";
import { setupDB } from "../startup/db";
import { exit } from "process";
import { seed_categories, seed_manufactureres, seed_orders, seed_products, seed_users } from "./data";

async function populateDb() {
  try {
    setupDB();

    await User.collection.insertMany(seed_users);

    await Category.collection.insertMany(seed_categories);

    await Manufacturer.collection.insertMany(seed_manufactureres);

    await Product.collection.insertMany(seed_products);
    
    await Order.collection.insertMany(seed_orders);

    console.log("=========================");
    console.log("| [ SEEDING COMPLETED ] |");
    console.log("=========================");
    process.exit(0);
  } catch (e) {
    console.error(e);
    exit(1);
  }
}

populateDb();
