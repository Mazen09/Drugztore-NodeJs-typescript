const Joi = require("joi");
import { Model, Schema, model } from "mongoose";

interface IManufacturer {
  name: string;
  email: string;
  mobile: string;
  address: string;
}

interface ManufacturerModel extends Model<IManufacturer> {
  lookup(email: string): Promise<any>;
}

const manufacturerSchema = new Schema<IManufacturer, ManufacturerModel>({
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
  mobile: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 50,
  },
  address: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
});

manufacturerSchema.static("lookup", function lookup(email: string) {
  return this.findOne({ email });
});

export const manufacturer = model<IManufacturer, ManufacturerModel>(
  "Manufacturer",
  manufacturerSchema
);

export function validateManufacturer(manufacturer: any) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    mobile: Joi.string().pattern(new RegExp("^[0-9]{10,50}$")).required(),
    address: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(manufacturer);
}
