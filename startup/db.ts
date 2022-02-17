import mongoose from "mongoose";
import winston from "winston";
import config from "config";
import Grid from "gridfs-stream";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import { isAllowedContentType } from "../utils/utils";
const { GridFsStorage } = require("multer-gridfs-storage");

const db: string = config.get("db");

// Create storage engine
const storage = new GridFsStorage({
  url: db,
  file: (req: any, file: Express.Multer.File) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!isAllowedContentType(file.mimetype))
      cb(new Error("Invalid file type"));
    cb(null, true);
  },
});

export function setupDB() {
  let gfs: any;
  mongoose
    .connect(db)
    .then((conn: any) => {
      gfs = Grid(conn.connections[0].db, mongoose.mongo);
      gfs.collection("uploads");
    })
    .then(() => winston.info(`connected to ${db}.`));
}
