import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { router as users } from "../routes/users";
import { router as categories } from "../routes/category";
import { router as manufacturer } from "../routes/manufacturer";
import { router as products } from "../routes/product";
import { router as uploads } from "../routes/uploads";

const methodOverride = require("method-override");

export function setupRoutes(app: Application) {
  app.use(express.json()); // use json middleware
  app.use(bodyParser.json());
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true })); //enable xml
  app.use(morgan("tiny"));
  app.use(express.static("public"));
  // TODO add routes and middlewares
  app.use("/api/users", users);
  app.use("/api/categories", categories);
  app.use("/api/manufactureres", manufacturer);
  app.use("/api/uploads", uploads);
  app.use("/api/products", products);
}
