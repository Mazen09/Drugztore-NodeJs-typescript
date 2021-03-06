import express, { Application, Request, Response } from "express";
import winston from "winston";
import { applyCofigurations } from "./startup/config";
import { setupDB } from "./startup/db";
import { startLogger } from "./startup/logging";
import { setupRoutes } from "./startup/routes";
import { setupValidations } from "./startup/validations";

const app: Application = express();

startLogger();
applyCofigurations();
setupRoutes(app);
setupDB();
setupValidations();

var port = process.env.PORT || 3000;
if (process.env.NODE_ENV == "test") port = 0;

export const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}`)
);
