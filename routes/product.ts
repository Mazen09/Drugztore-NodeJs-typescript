import express from "express";
import _ from "lodash";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { validateObjectId } from "../middlewares/validateObjectId";
import { Category } from "../models/category";
import { Manufacturer } from "../models/manufacturer";
import { validateProduct, Product } from "../models/product";
import { gfs, upload } from "../startup/db";
import mongoose from "mongoose";
import { admin } from "../middlewares/admin";

export const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find().sort("dateAdded");
  res.send(products);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) res.status(404).send("The product with given id was not found");
  else res.send(product);
});

router.post("/", auth, validate(validateProduct), async (req, res) => {
  const manufacturer = await Manufacturer.findById(req.body.manufacturerId);
  if (!manufacturer)
    return res.status(404).send("manufacturer with given id not found.");

  const category = await Category.findById(req.body.categoryId);
  if (!category)
    return res.status(404).send("category with given id not found.");

  const images: any[] = [];
  const product = new Product({
    name: req.body.name,
    manufacturer: {
      _id: manufacturer._id,
      name: manufacturer.name,
      email: manufacturer.email,
    },
    numberInStock: req.body.numberInStock,
    activeIngredients: req.body.activeIngredients,
    category: {
      _id: category._id,
      name: category.name,
    },
    rate: req.body.rate,
    price: req.body.price,
    description: req.body.description,
  });

  // check if images ids sent
  let messages: any = [];
  if (req.body.images) {
    let imgs = <string[]>req.body.images;
    for (let i = 0; i < imgs.length; i++) {
      const file = await gfs.files.findOne({
        _id: new mongoose.Types.ObjectId(imgs[i]),
      });
      if (!file) messages.push(`File with id ${imgs[i]} doesn't exist.`);
      else images.push({ _id: file._id, filename: file.filename });
    }
  }

  if (messages.length > 0) {
    res.status(404).send(messages);
  } else {
    product.images = images;
    await product.save();
    res.send(product);
  }
});

router.put(
  "/:id",
  auth,
  validateObjectId,
  validate(validateProduct),
  async (req, res) => {
    const manufacturer = await Manufacturer.findById(req.body.manufacturerId);
    if (!manufacturer)
      return res.status(404).send("manufacturer with given id not found.");

    const category = await Category.findById(req.body.categoryId);
    if (!category)
      return res.status(404).send("category with given id not found.");

    const images: any[] = [];
    let messages: any = [];
    if (req.body.images) {
      let imgs = <string[]>req.body.images;
      for (let i = 0; i < imgs.length; i++) {
        const file = await gfs.files.findOne({
          _id: new mongoose.Types.ObjectId(imgs[i]),
        });
        if (!file) messages.push(`File with id ${imgs[i]} doesn't exist.`);
        else images.push({ _id: file._id, filename: file.filename });
      }
    }

    if (messages.length > 0) {
      res.status(404).send(messages);
    } else {
      let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            manufacturer: {
              _id: manufacturer._id,
              name: manufacturer.name,
              email: manufacturer.email,
            },
            numberInStock: req.body.numberInStock,
            activeIngredients: req.body.activeIngredients,
            category: {
              _id: category._id,
              name: category.name,
            },
            rate: req.body.rate,
            price: req.body.price,
            description: req.body.description,
            images: images,
          },
        },
        { new: true }
      );
      if (!product)
        return res
          .status(404)
          .send("The product with the given ID was not found.");

      res.send(product);
    }
  }
);

router.delete("/:id", auth, admin, validateObjectId, async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});
