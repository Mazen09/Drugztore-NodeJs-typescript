import { Server } from "http";
import { server } from "../../index";
import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models/user";
import { gfs } from "../../startup/db";

jest.useFakeTimers();

const endpoint: string = "/api/uploads";

describe(endpoint, () => {
  let s: Server;

  beforeEach(async () => {
    s = server;
  });

  afterEach(async () => {
    await s.close();
    await gfs?.files.remove({});
  });

  describe("POST /", () => {
    let token: string;

    const exec = async () => {
      return await request(s)
        .post(endpoint)
        .set("x-auth-token", token)
        .attach("files", "./tests/integration/assets/image.png");
    };

    beforeEach(() => {
      const user: any = new User();
      token = user.generateAuthToken();
    });

    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      console.log(res.files)
      expect(res.status).toBe(401);
    });
  });
});
