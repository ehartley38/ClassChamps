const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User registration succeeds", () => {
  test("with valid data", async () => {
    const newUser = {
      username: "testuser1",
      name: "Jimmy",
      password: "Password1",
    };

    await api
      .post("/api/register")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain("testuser1");

    const names = usersAtEnd.map((user) => user.name);
    expect(names).toContain("Jimmy");

    const roles = usersAtEnd.map((user) => user.roles);
    expect(roles[0]).toHaveProperty("Student");
  });
});

describe("User registration fails", () => {
  test("with missing username", async () => {
    const newUser = {
      name: "Jimmy",
      password: "Password1",
    };

    await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(0);
  });

  test("with missing name", async () => {
    const newUser = {
      username: "testuser1",
      password: "Password1",
    };

    await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(0);
  });

  test("with missing password", async () => {
    const newUser = {
      username: "testuser1",
      name: "Jimmy",
    };

    await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(0);
  });

  test("with duplicate username", async () => {
    const newUser = {
      username: "testuser1",
      name: "Jimmy",
      password: "Password1",
    };

    await api
      .post("/api/register")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    await api
      .post("/api/register")
      .send(newUser)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(1);
  });
});
