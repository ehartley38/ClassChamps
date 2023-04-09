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
const Quiz = require("../models/quiz");
const BingoQuestion = require("../models/bingoQuestion");
const Assignment = require("../models/assignment");

let accessToken = undefined;
let user = undefined;
let classroomObjects = [];

beforeEach(async () => {
  app.use(cookieParser());
  await User.deleteMany({});
  await Classroom.deleteMany({});
  await Quiz.deleteMany({});
  await BingoQuestion.deleteMany({});

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

describe("Adding a new Bingo quiz", () => {
  test("succeeds with valid data", async () => {
    const newQuiz = {
      quizName: "Test Quiz",
      quizType: "Bingo",
    };

    const response = await api
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newQuiz)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const quiz = response.body;
    expect(quiz.quizName).toBe(newQuiz.quizName);
    expect(quiz.quizType).toBe(newQuiz.quizType);
    expect(quiz.questions).toHaveLength(0);
    expect(quiz.creator[0].toString()).toEqual(user.id);

    const userAtEnd = await User.findById(user.id);
    expect(userAtEnd.quizzes).toHaveLength(1);
    expect(userAtEnd.quizzes[0].toString()).toEqual(quiz.id);

    const quizAtEnd = await Quiz.findById(quiz.id);
    expect(quizAtEnd.quizName).toBe(newQuiz.quizName);
    expect(quizAtEnd.quizType).toBe(newQuiz.quizType);
  });

  test("fails with status code 400 if data is invalid", async () => {
    const newQuiz = {
      quizName: "Test Quiz missing quizName",
    };

    await api
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newQuiz)
      .expect(400);
  });
});

describe("Retrieving all a users bingo quizzes ", () => {
  test("succeeds with valid access token", async () => {
    const newQuiz = {
      quizName: "Test Quiz",
      quizType: "Bingo",
    };

    const response = await api
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newQuiz)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response2 = await api
      .get("/api/quizzes")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const quizzes = response2.body;
    expect(quizzes).toHaveLength(1);
    expect(quizzes[0].quizName).toBe(newQuiz.quizName);
    expect(quizzes[0].quizType).toBe(newQuiz.quizType);
    expect(quizzes[0].questions).toHaveLength(0);
    expect(quizzes[0].creator[0].toString()).toEqual(user.id);
  });

  test("fails with status code 401 if access token is invalid", async () => {
    const newQuiz = {
      quizName: "Test Quiz",
      quizType: "Bingo",
    };

    const response = await api
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newQuiz)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    await api
      .get("/api/quizzes")
      .set("Authorization", `Bearer invalidToken`)
      .expect(403);
  });
});

describe("Deleting a bingo quiz", () => {
  test("succeeds with valid quiz id", async () => {
    // Create the quiz
    const newQuiz = {
      quizName: "Test Quiz",
      quizType: "Bingo",
    };

    const response = await api
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newQuiz);

    const quiz = response.body;

    // Create the assignment and assign quiz to it
    const newAssignment = {
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    };

    const assignmentResponse = await api
      .post("/api/assignments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newAssignment)
      .expect(201);

    const assignment = assignmentResponse.body;

    // Delete the quiz
    await api
      .delete(`/api/quizzes/${quiz.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(204);

    // Check that the quiz is deleted
    const quizAtEnd = await Quiz.findById(quiz.id);
    expect(quizAtEnd).toEqual(null);

    // Check that the quiz is deleted from the user
    const userAtEnd = await User.findById(user.id);
    expect(userAtEnd.quizzes).toHaveLength(0);

    // Check that the assignment is deleted
    const assignmentAtEnd = await Assignment.findById(assignment.id);
    expect(assignmentAtEnd).toBeNull();

    // TODO: Check all questions related to this quiz are deleted
  });

  test("fails with status code 400 if quiz id is invalid", async () => {
    await api
      .delete(`/api/quizzes/invalidId`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);
  });
});
