import { Model, Schema, model } from "mongoose";
const Joi = require("joi");

interface ICategory {
  name: string;
}

interface CategoryModel extends Model<ICategory> {
  lookup(name: string): Promise<any>;
}

const categorySchema = new Schema<ICategory, CategoryModel>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

categorySchema.static("lookup", function lookup(name: string) {
  return this.findOne({ name });
});

export const Category = model<ICategory, CategoryModel>(
  "Category",
  categorySchema
);

export function validateCategory(category: any) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(category);
}
