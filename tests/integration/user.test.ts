// POST /api/users
// should return 400 if name is less than 5 characters
// should return 400 if name is more than 50 characters
// should return 400 if email is less than 5 characters
// should return 400 if email is more than 255 characters
// should return 400 if email is invalid
// should return 400 if password is less than 8 characters
// should return 400 if password is more than 255 characters
// should return 400 if user already registered
// should return 200 is user is valid
// should return header x-auth-token if user is valid
// should return user object [_id, name, email] if user is valid

import { Server } from "http";
import { server } from "../../index";
import { User } from "../../models/user";
import request from "supertest";

describe("api/users", () => {
  let s: Server;
  let email: string;
  let name: string;
  let password: string;
  let user;
  beforeEach(async () => {
    email = "a@b.com";
    name = "user1";
    password = "123456789";
    s = server;

    user = new User({
      name: name,
      email: email,
      password: password,
    });
    await user.save();
  });

  afterEach(async () => {
    await s.close();
    await User.remove({});
  });

  const exec = () => {
    return request(s).post("/api/users").send({ name, email, password });
  };

  it("should return 400 if name is less than 5 characters", async () => {
    name = new Array(4).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if name is more than 50 characters", async () => {
    name = new Array(52).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is less than 5 characters", async () => {
    email = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is more than 255 characters", async () => {
    email = new Array(257).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is invalid", async () => {
    email = new Array(10).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is less than 5 characters", async () => {
    password = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is more than 255 characters", async () => {
    password = new Array(257).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if user already registered", async () => {
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 is user is valid", async () => {
    email = "b@c.com";
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should return header x-auth-token if user is valid", async () => {
    email = "b@c.com";
    const res = await exec();

    expect(res.headers["x-auth-token"]).toBeDefined();
  });

  it("should return user object [_id, name, email] if user is valid", async () => {
    email = "b@c.com";
    await exec();
    const user = await User.lookup(email);

    expect(user).not.toBeNull();
    expect(user).toMatchObject({ name: "user1", email: email });
  });
});
