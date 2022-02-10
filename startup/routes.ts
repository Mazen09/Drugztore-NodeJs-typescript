import express, { Application } from "express";
import morgan from 'morgan';

export function setupRoutes(app: Application) {
  app.use(express.json()); // use json middleware
  app.use(express.urlencoded({ extended: true })); //enable xml
  app.use(morgan("tiny"));
  app.use(express.static("public"));
  // TODO add routes and middlewares
}
