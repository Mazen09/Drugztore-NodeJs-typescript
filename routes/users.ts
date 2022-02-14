import express from "express";
import { validate } from "../middlewares/validate";
import { User, validateUser } from "../models/user";
import bcrypt from 'bcrypt';
import _ from 'lodash';

export const router = express.Router();

router.post("/", validate(validateUser), async (req, res) => {
  let user = await User.lookup(req.body.email);
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});
