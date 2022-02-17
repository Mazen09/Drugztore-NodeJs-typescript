const Joi = require("joi");
import { Model, Schema, model } from "mongoose";
import mongoose from "mongoose";
import { categorySchema } from "./category";

interface IProduct {
  name: string;
  manufacturer: any;
  activeIngredients: any;
  category: any;
  rate: number;
  price: number;
  description: string;
  numberInStock: number;
  images: any[];
  dateAdded: Date;
}

interface ProductModel extends Model<IProduct> {}

const productSchema = new Schema<IProduct, ProductModel>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  manufacturer: new Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
  }),
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 500,
  },
  activeIngredients: {
    type: Array,
    validate: {
      validator: function (v: any) {
        return v && v.length > 0;
      },
      message: "Product must have atleast on active ingredient",
    },
  },
  category: {
    type: categorySchema,
    required: true,
  },
  rate: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  description: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 500,
  },
  images: [
    new Schema({
      fileName: {
        type: String,
        required: true,
      },
    }),
  ],
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

export const Product = model<IProduct, ProductModel>("Product", productSchema);

export function validateProduct(product: any) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    manufacturerId: Joi.ObjectId().required(),
    numberInStock: Joi.number().min(0).max(500).required(),
    categoryId: Joi.ObjectId().required(),
    rate: Joi.number().min(0).max(5),
    price: Joi.number().min(0).max(10000).required(),
    description: Joi.string().min(50).max(500).required(),
    dateAdded: Joi.date(),
    activeIngredients: Joi.array()
      .required()
      .min(2)
      .max(10)
      .items(Joi.string().min(5).max(50)),
  });

  return schema.validate(product);
}
