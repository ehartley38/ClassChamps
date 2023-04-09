// Test file for student classrooms

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);
const Classroom = require("../models/classroom");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const cookieParser = require("cookie-parser");

let accessToken = {};
let user = undefined;
let classroomObjects = [];
let loginResponse = undefined;

beforeEach(async () => {
  app.use(cookieParser());
  await Classroom.deleteMany({});
  await User.deleteMany({});

  user = await new User(helper.initialUsers[0]).save();
  // Create mock classroom data
  classroomObjects = helper
    .generateStudentsInitialClassrooms(user.id)
    .map((classroom) => new Classroom(classroom));
  const promiseArray = classroomObjects.map((classroom) => classroom.save());
  await Promise.all(promiseArray);

  // Log user in
  loginResponse = await api
    .post("/api/login")
    .send({ username: "testuser1", password: "Password1" });

  accessToken = loginResponse.body["accessToken"];
});

describe("Requesting a students ", () => {
  test("enrolled classes is successful", async () => {
    const response = await api
      .get("/api/classrooms/studentClassrooms")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.body).toHaveLength(3);
  });

  test("enrolled classes returns a specific classroom", async () => {
    const response = await api
      .get("/api/classrooms/studentClassrooms")
      .set("Authorization", `Bearer ${accessToken}`);

    const roomNames = response.body.map((r) => r.roomName);
    expect(roomNames).toContain("Test Classroom 1");
  });
});

describe("Joining a classroom ", () => {
  test("with an invalid room code returns 404", async () => {
    const response = await api
      .put("/api/classrooms/join")
      .send({ code: "XXXXXX" })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);
  });

  test("with a valid room code returns 200 and updates the classroom document with the user ID reference", async () => {
    const response = await api
      .put("/api/classrooms/join")
      .send({ roomCode: "123ABC" })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const joinedClassroom = await Classroom.findOne({ roomCode: "123ABC" });
    expect(joinedClassroom.students[0].toString()).toEqual(user.id);
  });
});
