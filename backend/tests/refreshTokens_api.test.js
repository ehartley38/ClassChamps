const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const helper = require("./test_helper");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const cookieParser = require("cookie-parser");

beforeEach(async () => {
  app.use(cookieParser());
  await User.deleteMany({});
  const user = await new User(helper.initialUsers[0]).save();

  //const response = await api.post("/api/login").send(helper.initialUsers[0]);
});

describe("When a user requests a new access token", () => {
  test("401 is returned if no cookie is sent", async () => {
    await api.get("/api/refreshTokens").expect(401);
  });

  test("403 is returned if refresh token not in database", async () => {
    const invalidRefreshToken = jwt.sign(
      { username: "fakeUser1" },
      config.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await api
      .get("/api/refreshTokens")
      .set("Cookie", `jwt=${invalidRefreshToken}`)
      .expect(403);
  });
});

describe("A new access token is sent in the response", () => {
  test("if valid refresh token is sent", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "testuser1", password: "Password1" });

    const refreshResponse = await api
      .get("/api/refreshTokens")
      .set("Cookie", response.headers["set-cookie"][0])
      .expect(200);

    expect(refreshResponse.body).toHaveProperty("accessToken");
    expect(refreshResponse.body).toHaveProperty("roles");
  });
});
