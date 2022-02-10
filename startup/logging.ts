import winston from "winston";
import { format } from "winston";
import { MongoDBTransportInstance } from "winston-mongodb";
import config from "config";

const {
  MongoDB,
}: { MongoDB: MongoDBTransportInstance } = require("winston-mongodb");
const db: string = config.get("db");

export function startLogger() {
  winston.configure({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "./logs/info.log",
        level: "info",
      }),
      new winston.transports.File({
        filename: "./logs/error.log",
        level: "error",
      }),
      new MongoDB({ db: db, level: "info" }),
    ],
    format: format.combine(
      format.timestamp(),
      format.json(),
      format.metadata(),
    ),
  });

  process.on("unhandledRejection", (ex: Error) => {
    winston.error(ex.message, [ex]);
    process.exit(1);
  });

  winston.exceptions.handle(
    new winston.transports.File({
      filename: "./logs/unchaughtExceptions.log",
    }),
    new MongoDB({ db: db }),
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.prettyPrint()),
    })
  );
}
