import express from "express";
import { auth } from "../middlewares/auth";
import { gfs, gridfsBucket, upload } from "../startup/db";
import mongoose from "mongoose";

export const router = express.Router();

router.post("/", auth, upload.array("files"), (req, res) => {
  res.json({ files: req.files });
});

router.get("/:id", async (req, res) => {
  const file = await gfs.files.findOne({
    _id: new mongoose.Types.ObjectId(req.params.id),
  });
  if (!file) res.status(404).send("The file with given id was not found");
  else res.send(file);
});

router.get("/view/:id", async (req, res) => {
  const file = await gfs.files.findOne({
    _id: new mongoose.Types.ObjectId(req.params.id),
  });
  if (!file) res.status(404).send("The file with given id was not found");
  else {
    const readstream = gridfsBucket.openDownloadStream(file._id);
    readstream.pipe(res);
  }
});
