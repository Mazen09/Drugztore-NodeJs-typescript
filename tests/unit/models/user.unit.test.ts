import mongoose from "mongoose";
import { User } from "../../../models/user";
import jwt from "jsonwebtoken";
import config from "config";

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const id = new mongoose.Types.ObjectId();
    let user: any = new User({ _id: id, isAdmin: true });
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject({ _id: id, isAdmin: true });
  });
});
