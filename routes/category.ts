import express from "express";
import { validate } from "../middlewares/validate";
import { Category, validateCategory } from "../models/category";
import _ from "lodash";
import { validateObjectId } from "../middlewares/validateObjectId";
import { auth } from "../middlewares/auth";
import { admin } from "../middlewares/admin";

export const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find().sort("name");
  res.send(categories);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category)
    res.status(404).send("The category with given id was not found");
  else res.send(category);
});

router.post("/", validate(validateCategory), auth, async (req, res) => {
  let category = new Category({ name: req.body.name });
  await category.save();
  res.send(category);
});

router.put(
  "/:id",
  auth,
  validate(validateCategory),
  validateObjectId,
  async (req, res) => {
    let category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { name: req.body.name } },
      { new: true }
    );

    if (!category)
      return res
        .status(404)
        .send("The category with the given ID was not found.");

    res.send(category);
  }
);

router.delete("/:id", auth, admin, validateObjectId, async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});
