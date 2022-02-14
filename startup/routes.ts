import express, { Application } from "express";
import morgan from 'morgan';
import { router as users } from "../routes/users";

export function setupRoutes(app: Application) {
  app.use(express.json()); // use json middleware
  app.use(express.urlencoded({ extended: true })); //enable xml
  app.use(morgan("tiny"));
  app.use(express.static("public"));
  // TODO add routes and middlewares
  app.use("/api/users", users);
}
