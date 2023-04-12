const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);
const User = require("../models/user");
const bcrypt = require("bcrypt");
const config = require("../utils/config");
const cookieParser = require("cookie-parser");

let accessToken = undefined;
let user = undefined;
let cookie = undefined;

beforeEach(async () => {
  app.use(cookieParser());
  await User.deleteMany({});

  // Create a user
  user = await new User(helper.initialUsers[0]).save();

  // Log user in
  loginResponse = await api
    .post("/api/login")
    .send({ username: "testuser1", password: "Password1" });

  accessToken = loginResponse.body["accessToken"];
  cookie = loginResponse.headers["set-cookie"][0];
});

test("If a valid refresh token is sent, user is logged out and cookies cleared in response", async () => {
  const logoutResponse = await api
    .get("/api/logout")
    .set("Cookie", cookie)
    .expect(204);

  // Check user's refresh token is cleared
  const userAtEnd = await User.findOne({ id: user.id });
  expect(userAtEnd.refreshToken).toBe("");

  // Check cookie is cleared
  expect(logoutResponse.headers["set-cookie"][0]).toBe(
    "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None"
  );
});

test("If an invalid refresh token is sent, user cookies are cleared in response", async () => {
  const logoutResponse = await api
    .get("/api/logout")
    .set("Cookie", "jwt=invalidCookie")
    .expect(204);

  // Check cookie is cleared
  expect(logoutResponse.headers["set-cookie"][0]).toBe(
    "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None"
  );

  // Check user's refresh token is not cleared
  const userAtEnd = await User.findOne({ id: user.id });
  expect(userAtEnd.refreshToken).not.toBe("");
});
