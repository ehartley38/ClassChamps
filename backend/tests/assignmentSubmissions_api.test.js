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
const Assignment = require("../models/assignment");
const Quiz = require("../models/quiz");
const BingoQuestion = require("../models/bingoQuestion");
const AssignmentSubmission = require("../models/assignmentSubmission");

let accessToken = undefined;
let user = undefined;
let classroomObjects = [];
let quiz = undefined;
let assignment = undefined;

beforeEach(async () => {
  app.use(cookieParser());
  await Classroom.deleteMany({});
  await User.deleteMany({});
  await Assignment.deleteMany({});
  await Quiz.deleteMany({});
  await BingoQuestion.deleteMany({});
  await AssignmentSubmission.deleteMany({});

  // Create a user with role student
  user = await new User(helper.initialUsers[0]).save();

  // Create mock classroom data
  classroomObjects = helper
    .generateStudentsInitialClassrooms(user._id)
    .map((classroom) => new Classroom(classroom));
  const promiseArray = classroomObjects.map((classroom) => classroom.save());
  await Promise.all(promiseArray);

  // Log user in
  loginResponse = await api
    .post("/api/login")
    .send({ username: "testuser1", password: "Password1" });

  accessToken = loginResponse.body["accessToken"];

  // Create a bingo quiz and add questions to it
  quiz = await new Quiz({ quizName: "Test Quiz", quizType: "Bingo" }).save();

  const questionObjects = helper
    .generateBingoQuestions(quiz.id)
    .map((question) => new BingoQuestion(question));
  const questionPromiseArray = questionObjects.map((question) =>
    question.save()
  );
  await Promise.all(questionPromiseArray);

  quiz.questions = questionObjects.map((question) => question.id);
  await quiz.save();

  // Create an assignment
  assignment = await new Assignment({
    assignmentName: "Test Assignment",
    quizId: quiz.id,
    classroomId: classroomObjects[0].id,
    dueDate: new Date(),
  }).save();
});

describe("Submitting an assignment", () => {
  test("creates the submission successfully", async () => {
    const newSubmission = {
      assignment: assignment.id,
      student: user.id,
    };

    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const submissions = await AssignmentSubmission.find({});
    expect(submissions).toHaveLength(1);
  });

  test("handles xp gains correctly", async () => {
    // This should only earn me 1 badge (first Steps) so therefore 150XP in total
    const newSubmission = {
      assignment: assignment.id,
      student: user.id,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    expect(response.body["xpGain"]).toBe(150);

    // Submit the assignment again. This should earn me 1 badge (Perseverance Pro) and 100XP in total
    const newSubmission2 = {
      assignment: assignment.id,
      student: user.id,
    };

    const response2 = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission2)
      .expect(201);

    expect(response2.body["xpGain"]).toBe(100);

    // Check that the user's xp has been updated
    const userAtEnd = await User.findById(user.id);
    expect(userAtEnd.experiencePoints).toBe(250);
  });
});

describe("Retrieving all assignment submissions", () => {
  test("returns all submissions successfully", async () => {
    const newSubmission = {
      assignment: assignment.id,
      student: user.id,
    };

    const newSubmission2 = {
      assignment: assignment.id,
      student: user.id,
    };

    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission2)
      .expect(201);

    const response = await api
      .get("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveLength(2);
  });

  test("fails if data is missing", async () => {
    const newSubmission = {};

    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(400);

    const submissions = await AssignmentSubmission.find({});
    expect(submissions).toHaveLength(0);

    const response = await api
      .get("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(204);

    expect(response.body).toEqual({});
  });
});
