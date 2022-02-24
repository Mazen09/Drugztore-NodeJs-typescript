const Joi = require("joi");
import { Model, Schema, model } from "mongoose";

interface IManufacturer {
  name: string;
  email: string;
  mobile: string;
  address: string;
}

interface ManufacturerModel extends Model<IManufacturer> {
  checkForUniqueFields(obj: any, id?: any): string | undefined;
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

manufacturerSchema.static(
  "checkForUniqueFields",
  async function checkForUniqueFields(obj: any, id?: any) {
    if (obj.email) {
      let m = await this.find({ email: obj.email });
      if (m.length > 0 && id && m[0]._id != id)
        return "Manufacturer with same email already exist";
    }
    if (obj.mobile) {
      let m = await this.find({ mobile: obj.mobile });
      if (m.length > 0 && id && m[0]._id != id)
        return "Manufacturer with same mobile already exist";
    }
    if (obj.address) {
      let m = await this.find({ address: obj.address });
      if (m.length > 0 && id && m[0]._id != id)
        return "Manufacturer with same address already exist";
    }
  }
);

export const Manufacturer = model<IManufacturer, ManufacturerModel>(
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
