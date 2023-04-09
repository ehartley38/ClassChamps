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
let quiz = undefined;

beforeEach(async () => {
  app.use(cookieParser());
  await User.deleteMany({});
  await Classroom.deleteMany({});
  await Quiz.deleteMany({});
  await BingoQuestion.deleteMany({});
  await Assignment.deleteMany({});

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

  // Create a quiz and add questions to it
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

  const generatedQuestions = helper.generateBingoQuestions(quiz.id);
  await api
    .post("/api/bingoQuestions/addAllQuestions")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(generatedQuestions)
    .expect(201);
});

describe("Assignment creation", () => {
  test("is successful with valid data", async () => {
    const assignment = {
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    };

    await api
      .post("/api/assignments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(assignment)
      .expect(201);

    const assignments = await Assignment.find({});
    expect(assignments).toHaveLength(1);

    const classroomAtEnd = await Classroom.findById(classroomObjects[0].id);
    expect(classroomAtEnd.assignmentIds).toHaveLength(1);
  });

  test("fails with status code 400 if data is invalid", async () => {
    const assignment = {};

    await api
      .post("/api/assignments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(assignment)
      .expect(400);

    const assignments = await Assignment.find({});
    expect(assignments).toHaveLength(0);

    const classroomAtEnd = await Classroom.findById(classroomObjects[0].id);
    expect(classroomAtEnd.assignmentIds).toHaveLength(0);
  });

  test("fails with status code 401 if user is not an owner of classroom", async () => {
    const assignment = {
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[3].id,
      dueDate: new Date(),
    };

    await api
      .post("/api/assignments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(assignment)
      .expect(401);

    const assignments = await Assignment.find({});
    expect(assignments).toHaveLength(0);

    const classroomAtEnd = await Classroom.findById(classroomObjects[3].id);
    expect(classroomAtEnd.assignmentIds).toHaveLength(0);
  });
});

describe("Retrieving all assignments", () => {
  test("for a specific classroom is successful", async () => {
    const assignment = {
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    };

    await api
      .post("/api/assignments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(assignment)
      .expect(201);

    const response = await api
      .get(`/api/assignments/classroom/${classroomObjects[0].id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
  });

  test("for an invalid classroom fails with status code 400", async () => {
    const assignment = {
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    };

    await api
      .post("/api/assignments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(assignment)
      .expect(201);

    await api
      .get(`/api/assignments/classroom/invalidId`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);
  });
});

describe("Retrieving leaderboard data for an assignment", () => {
  test("returns valid data", async () => {});

  test("excludes students who have opted out", async () => {});
});
