import express from "express";
import { validate } from "../middlewares/validate";
import { Manufacturer, validateManufacturer } from "../models/manufacturer";
import _ from "lodash";
import { validateObjectId } from "../middlewares/validateObjectId";
import { auth } from "../middlewares/auth";
import { admin } from "../middlewares/admin";

export const router = express.Router();

router.get("/", async (req, res) => {
  const manufactureres = await Manufacturer.find().sort("name");
  res.send(manufactureres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const manufacturer = await Manufacturer.findById(req.params.id);
  if (!manufacturer)
    res.status(404).send("The manufacturer with given id was not found");
  else res.send(manufacturer);
});

router.post("/", validate(validateManufacturer), auth, async (req, res) => {
  const message = await Manufacturer.checkForUniqueFields(
    _.pick(req.body, ["email", "mobile", "address"]));
  if (message) return res.status(400).send(message);

  let manufacturer = new Manufacturer(
    _.pick(req.body, ["name", "email", "mobile", "address"])
  );
  await manufacturer.save();
  res.send(manufacturer);
});

router.put(
  "/:id",
  validate(validateManufacturer),
  auth,
  validateObjectId,
  async (req, res) => {
    const message = await Manufacturer.checkForUniqueFields(
      _.pick(req.body, ["email", "mobile", "address"]), req.params.id);
    if (message) return res.status(400).send(message);
    let manufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      { $set: _.pick(req.body, ["name", "email", "mobile", "address"]) },
      { new: true }
    );
    if (!manufacturer)
      return res
        .status(404)
        .send("The manufacturer with the given ID was not found.");

    res.send(manufacturer);
  }
);

router.delete("/:id", auth, admin, validateObjectId, async (req, res) => {
  const manufacturer = await Manufacturer.findByIdAndRemove(req.params.id);

  if (!manufacturer)
    return res
      .status(404)
      .send("The manufacturer with the given ID was not found.");

  res.send(manufacturer);
});
