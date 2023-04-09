// Test file for teacher classrooms

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

let accessToken = undefined;
let user = undefined;
let classroomObjects = [];

beforeEach(async () => {
  app.use(cookieParser());
  await Classroom.deleteMany({});
  await User.deleteMany({});

  // Create a user with role teacher
  user = await new User(helper.initialTeachers[0]).save();

  // Create mock classroom data
  classroomObjects = helper
    .generateTeachersInitialClassrooms(user._id)
    .map((classroom) => new Classroom(classroom));
  const promiseArray = classroomObjects.map((classroom) => classroom.save());
  await Promise.all(promiseArray);

  // Log user in
  loginResponse = await api
    .post("/api/login")
    .send({ username: "testteacher1", password: "Password1" });

  accessToken = loginResponse.body["accessToken"];
});

describe("Requesting a teachers", () => {
  test("created classrooms is successful", async () => {
    const response = await api
      .get("/api/classrooms/teacherClassrooms")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(3);
  });

  test("created classrooms returns a specific classroom", async () => {
    const response = await api
      .get("/api/classrooms/teacherClassrooms")
      .set("Authorization", `Bearer ${accessToken}`);

    const roomNames = response.body.map((r) => r.roomName);
    expect(roomNames).toContain("Test Classroom 1");
  });

  test("created classroom by classroom ID is successful", async () => {
    const response = await api
      .get(`/api/classrooms/${classroomObjects[0]._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.body.roomName).toEqual("Test Classroom 0");
  });
});

describe("Addition of a new classroom", () => {
  test("succeeds with valid data", async () => {
    const newClassroom = {
      roomName: "Test Classroom 4",
    };

    await api
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newClassroom)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const classroomsAtEnd = await helper.classroomsInDb();
    expect(classroomsAtEnd).toHaveLength(classroomObjects.length + 1);

    const roomNames = classroomsAtEnd.map((r) => r.roomName);
    expect(roomNames).toContain("Test Classroom 4");

    const createdClassroom = await Classroom.findOne({
      roomName: "Test Classroom 4",
    });
    expect(createdClassroom.owners[0].toString()).toEqual(user.id);

    const userAtEnd = await User.findById(user.id);
    expect(userAtEnd.classrooms).toHaveLength(user.classrooms.length + 1);
  });

  test("fails when no room name is submitted", async () => {
    const newClassroom = {
      roomName: "",
    };

    await api
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newClassroom)
      .expect(400);

    const classroomsAtEnd = await helper.classroomsInDb();
    expect(classroomsAtEnd).toHaveLength(classroomObjects.length);
  });
});

describe("Deletion of a classroom", () => {
  test("is successful with valid id", async () => {
    // First check if user is an owner of the classroom
    const response = await Classroom.findOne({
      roomName: classroomObjects[0].roomName,
    });
    expect(response.owners[0].toString()).toEqual(user.id);

    // Delete the classroom
    await api
      .delete(`/api/classrooms/${classroomObjects[0]._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(204);

    // Check if classroom is deleted
    const classroomsAtEnd = await helper.classroomsInDb();
    expect(classroomsAtEnd).toHaveLength(classroomObjects.length - 1);
  });

  test("fails if classroom does not exist", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api
      .delete(`/api/classrooms/${invalidId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);

    const classroomsAtEnd = await helper.classroomsInDb();
    expect(classroomsAtEnd).toHaveLength(classroomObjects.length);
  });

  test("fails if user is not an owner of the classroom", async () => {
    const newUserObject = await new User(helper.initialTeachers[1]).save();

    // Log new user in
    const newLoginResponse = await api
      .post("/api/login")
      .send({ username: "testteacher2", password: "Password1" });

    const newAccessToken = newLoginResponse.body["accessToken"];

    // Delete the classroom
    await api
      .delete(`/api/classrooms/${classroomObjects[0]._id}`)
      .set("Authorization", `Bearer ${newAccessToken}`)
      .expect(401);

    // Check classroom isn't deleted
    const classroomsAtEnd = await helper.classroomsInDb();
    expect(classroomsAtEnd).toHaveLength(classroomObjects.length);
  });

  test("after creating removes the classroom reference from the user", async () => {
    // Create classroom
    const newClassroom = {
      roomName: "Test Classroom 4",
    };

    await api
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newClassroom);

    const userObject = await User.findById(user.id);
    expect(userObject.classrooms).toHaveLength(user.classrooms.length + 1);

    // Delete classroom
    const classroomObject = await Classroom.findOne({
      roomName: "Test Classroom 4",
    });
    await api
      .delete(`/api/classrooms/${classroomObject._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    const userAtEnd = await User.findById(user.id);
    expect(userAtEnd.classrooms).toHaveLength(user.classrooms.length);
  });
});

describe("Generating a classroom code", () => {
  test("fails if user is not an owner of the classroom", async () => {
    // Create new user
    const newUserObject = await new User(helper.initialTeachers[1]).save();

    // Log new user in
    const newLoginResponse = await api
      .post("/api/login")
      .send({ username: "testteacher2", password: "Password1" });

    const newAccessToken = newLoginResponse.body["accessToken"];

    // Attempt to generate code for classroom the new user is not an owner of
    await api
      .put(`/api/classrooms/${classroomObjects[0]._id}/generate-code`)
      .set("Authorization", `Bearer ${newAccessToken}`)
      .send({ owners: [user.id] })
      .expect(401);
  });

  test("which is a duplicate causes a code generation to re-execute", async () => {
    // Set room code as 123456
    await api
      .put(`/api/classrooms/${classroomObjects[0]._id}/generate-code`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        id: classroomObjects[0]._id,
        owners: [user.id],
        isTest: true,
      })
      .expect(200);

    const classroomObject = await Classroom.findById(classroomObjects[0]._id);
    expect(classroomObject.roomCode).toEqual("123456");

    // Attempt to set roomcode as 123456 again for antoher classroom
    await api
      .put(`/api/classrooms/${classroomObjects[1]._id}/generate-code`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        id: classroomObjects[1]._id,
        owners: [user.id],
        isTest: true,
      })
      .expect(200);

    const classroomObject2 = await Classroom.findById(classroomObjects[1]._id);
    expect(classroomObject2.roomCode).not.toEqual("123456");
  });

  test("which is unique succeeds", async () => {
    await api
      .put(`/api/classrooms/${classroomObjects[0]._id}/generate-code`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        id: classroomObjects[0]._id,
        owners: [user.id],
      })
      .expect(200);

    const classroomObject = await Classroom.findById(classroomObjects[0]._id);
    expect(classroomObject.roomCode).toHaveLength(6);
  });
});

describe("Removing a studet from a classroom", () => {
  test("fails if user is not an owner of the classroom", async () => {
    // Create new user
    const newUserObject = await new User(helper.initialTeachers[1]).save();

    // Log new user in
    const newLoginResponse = await api
      .post("/api/login")
      .send({ username: "testteacher2", password: "Password1" });

    const newAccessToken = newLoginResponse.body["accessToken"];

    // Attempt to remove student from classroom
    await api
      .put(
        `/api/classrooms/${classroomObjects[0]._id}/removeUser/63fcf1bddfe6c42656baf4e2`
      )
      .set("Authorization", `Bearer ${newAccessToken}`)
      .expect(401);
  });

  test("succeeds if user is an owner of the classroom", async () => {
    // First check that the student is enrolled in the classroom
    const classroomObject1 = await Classroom.findById(classroomObjects[0]._id);
    expect(classroomObject1.students[0].toString()).toContain(
      "63fcf1bddfe6c42656baf4e2"
    );

    // Create new student who is enrolled in the classroom we are removing them from
    const newStudent = {
      _id: "63fcf1bddfe6c42656baf4e2",
      username: "testuser4",
      name: "Charles",
      passwordHash:
        "$2b$10$MrHTLOWAbq/NRIIKIFSib.fv2VTy2btSIqE4OeD244sB3Z5l1Sn.6",
      classrooms: [classroomObjects[0]._id],
    };
    await new User(newStudent).save();

    // Remove student from classroom
    await api
      .put(
        `/api/classrooms/${classroomObjects[0]._id}/removeUser/63fcf1bddfe6c42656baf4e2`
      )
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    // Check student is no longer enrolled in the classroom
    const classroomObject2 = await Classroom.findById(classroomObjects[0]._id);
    expect(classroomObject2.students).not.toContainEqual(newStudent._id);

    // Check student is no longer enrolled in the classroom in the user object
    const userAtEnd = await User.findById(newStudent._id);
    expect(userAtEnd.classrooms).not.toContainEqual(classroomObjects[0]._id);
  });
});
