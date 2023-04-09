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

let accessToken = undefined;
let user = undefined;
let classroomObjects = [];
let quiz = undefined;

beforeEach(async () => {
  app.use(cookieParser());
  await User.deleteMany({});
  await Classroom.deleteMany({});
  await Quiz.deleteMany({});

  // Create a user with role teacher
  user = await new User(helper.initialTeachers[0]).save();

  // Log user in
  loginResponse = await api
    .post("/api/login")
    .send({ username: "testteacher1", password: "Password1" });

  accessToken = loginResponse.body["accessToken"];

  // Create a quiz
  const newQuiz = {
    quizName: "Test Quiz",
    quizType: "Bingo",
  };

  const response = await api
    .post("/api/quizzes")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(newQuiz)
    .expect(201);

  quiz = response.body;
});

describe("Adding an array of bingo questions", () => {
  test("succeeds with valid data", async () => {
    const newBingoQuestions = [
      {
        parentQuiz: quiz.id,
        question: "Test Question1",
        answer: "Test Answer1",
        hint: "Test Hint1",
      },
      {
        parentQuiz: quiz.id,
        question: "Test Question2",
        answer: "Test Answer2",
        hint: "Test Hint2",
      },
      {
        parentQuiz: quiz.id,
        question: "Test Question3",
        answer: "Test Answer3",
        hint: "Test Hint3",
      },
    ];

    const response2 = await api
      .post("/api/bingoQuestions/addAllQuestions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newBingoQuestions)
      .expect(201);

    const quizAtEnd = await Quiz.findById(quiz.id);
    expect(quizAtEnd.questions).toHaveLength(3);
  });

  test("fails with status code 400 if parentQuiz id is invalid", async () => {
    const newBingoQuestions = [
      {
        parentQuiz: "invalidId",
        question: "Test Question1",
        answer: "Test Answer1",
        hint: "Test Hint1",
      },
      {
        parentQuiz: "invalidId",
        question: "Test Question2",
        answer: "Test Answer2",
        hint: "Test Hint2",
      },
      {
        parentQuiz: "invalidId",
        question: "Test Question3",
        answer: "Test Answer3",
        hint: "Test Hint3",
      },
    ];

    await api
      .post("/api/bingoQuestions/addAllQuestions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newBingoQuestions)
      .expect(400);
  });

  test("fails with status code 400 if data is invalid", async () => {
    const newBingoQuestions = [];

    await api
      .post("/api/bingoQuestions/addAllQuestions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newBingoQuestions)
      .expect(400);
  });
});
