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

test("User data is returned successfully when logged in", async () => {
  const response = await api
    .post("/api/login")
    .send({
      username: "testuser1",
      password: "Password1",
    })
    .expect(200);

  const accessToken = response.body.accessToken;

  await api.get("/api/users/id", async () => {
    const response = await api
      .get("/api/users/id")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toContain({
      username: "testuser1",
    });
  });
});

test("No User data is returned when not logged in", async () => {
  await api.get("/api/users/id", async () => {
    const response = await api.get("/api/users/id").expect(401);
  });
});
