const Joi = require("joi");
import config from "config";
import jwt from "jsonwebtoken";
import { Model, Schema, model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface UserModel extends Model<IUser> {
  generateAuthToken(): string;
  lookup(email: string): Promise<any>;
}

const userSchema = new Schema<IUser, UserModel>({
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
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.static("lookup", function lookup(email: string) {
  return this.findOne({ email });
});

userSchema.method("generateAuthToken", function generateAuthToken() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
});

export const User = model<IUser, UserModel>("User", userSchema);

export function validateUser(user: any) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{8,255}$"))
      .required(),
  });

  return schema.validate(user);
}
