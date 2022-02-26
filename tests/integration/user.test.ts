import { Server } from "http";
import { server } from "../../index";
import { User } from "../../models/user";
import request from "supertest";
import { seed_users } from "../../seeding/data";


describe("api/users", () => {
  let s: Server;
  let user: any;

  beforeEach(async () => {
    s = server;
    user = { ...seed_users[0] };
  });

  afterEach(async () => {
    await s.close();
    await User.deleteMany({});
  });

  const exec = () => {
    return request(s)
      .post("/api/users")
      .send({ name: user.name, email: user.email, password: user.password });
  };

  it("should return 400 if name is undefined", async () => {
    user.name = undefined;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if name is less than 5 characters", async () => {
    user.name = new Array(4).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if name is more than 50 characters", async () => {
    user.name = new Array(52).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is undefined", async () => {
    user.email = undefined;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is less than 5 characters", async () => {
    user.email = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is more than 255 characters", async () => {
    user.email = new Array(257).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is invalid", async () => {
    user.email = new Array(10).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is undefined", async () => {
    user.password = undefined;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is less than 5 characters", async () => {
    user.password = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is more than 255 characters", async () => {
    user.password = new Array(257).join("a");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if user already registered", async () => {
    await User.collection.insertOne(seed_users[0]);

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 is user is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should return header x-auth-token if user is valid", async () => {
    const res = await exec();

    expect(res.headers["x-auth-token"]).toBeDefined();
  });

  it("should return user object [_id, name, email] if user is valid", async () => {
    await exec();
    const res = await User.lookup(user.email);

    expect(user).not.toBeNull();
    expect(user).toMatchObject({ name: user.name, email: user.email });
  });
});
