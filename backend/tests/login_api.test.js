const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const helper = require("./test_helper");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

beforeEach(async () => {
  await User.deleteMany({});
  const userObjects = helper.initialUsers.map((user) => new User(user));
  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
});

describe("User login", () => {
  test("succeeds with valid data", async () => {
    const userDetails = {
      username: "testuser1",
      password: "Password1",
    };

    const accessToken = jwt.sign(
      {
        username: "testuser1",
        id: "63fcf1bddfe6c42656baf4e2",
      },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { username: "testuser1" },
      config.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const response = await api
      .post("/api/login")
      .send(userDetails)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual({
      roles: [2000],
      accessToken: accessToken,
    });

    expect(response.headers["set-cookie"][0]).toContain("jwt=" + refreshToken);

    const user = await User.findOne({ username: "testuser1" });
    expect(user.refreshToken).toEqual(refreshToken);
  });

  test("fails with invalid data", async () => {
    const userDetails = {
      username: "testuser2",
      password: "incorrectPassword",
    };

    await api
      .post("/api/login")
      .send(userDetails)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("fails with missing username", async () => {
    const userDetails = {
      password: "Password1",
    };

    await api
      .post("/api/login")
      .send(userDetails)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("fails with missing password", async () => {
    const userDetails = {
      username: "testuser1",
    };

    await api
      .post("/api/login")
      .send(userDetails)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});
