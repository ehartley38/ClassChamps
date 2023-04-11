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
const Badge = require("../models/badge");

let accessToken = undefined;
let user = undefined;
let classroomObjects = [];
let quiz = undefined;

beforeEach(async () => {
  app.use(cookieParser());
  await Classroom.deleteMany({});
  await User.deleteMany({});
  await Assignment.deleteMany({});
  await Quiz.deleteMany({});
  await BingoQuestion.deleteMany({});
  await AssignmentSubmission.deleteMany({});
  await Badge.deleteMany({});

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

  // Create badges
  const badgeObjects = helper.badges.map((badge) => new Badge(badge));
  const badgePromiseArray = badgeObjects.map((badge) => badge.save());
  await Promise.all(badgePromiseArray);
});

describe("First Steps badge", () => {
  test("is awarded successfully when criteria met", async () => {
    // Create an assignment
    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    }).save();

    // Create a submission
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: true,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const awardedBadges = response.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "First Steps")
    ).toBe(true);
  });

  test("is not awarded when criteria met for a second time", async () => {
    // Create an assignment
    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    }).save();

    // Create submissions
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: true,
    };

    const newSubmission2 = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: true,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const response2 = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission2)
      .expect(201);

    const awardedBadges = response2.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "First Steps")
    ).toBe(false);
  });
});

describe("Early Bird badge", () => {
  test("is awarded successfully when criteria met", async () => {
    // Create an assignment with due date 2 weeks from now
    const now = new Date();
    const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // add 14 days in milliseconds

    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: dueDate,
    }).save();

    // Create a submission
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: true,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const awardedBadges = response.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "Early Bird")
    ).toBe(true);
  });

  test("is not awarded when criteria met for a second time", async () => {
    // Create an assignment with due date 2 weeks from now
    const now = new Date();
    const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // add 14 days in milliseconds

    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: dueDate,
    }).save();

    // Create submissions
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: true,
    };

    const newSubmission2 = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: true,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const response2 = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission2)
      .expect(201);

    const awardedBadges = response2.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "Early Bird")
    ).toBe(false);
  });
});

describe("Bingo Genius badge", () => {
  test("is awarded successfully when criteria met", async () => {
    // Create an assignment
    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    }).save();

    // Create a submission
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: false,
      hintUsed: true,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const awardedBadges = response.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "Bingo Genius")
    ).toBe(true);
  });

  test("is not awarded when criteria met for a second time", async () => {
    // Create an assignment
    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    }).save();

    // Create submissions
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: false,
      hintUsed: true,
    };

    const newSubmission2 = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: false,
      hintUsed: true,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const response2 = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission2)
      .expect(201);

    const awardedBadges = response2.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "Bingo Genius")
    ).toBe(false);
  });
});

describe("Perserverance Pro badge", () => {
  test("is awarded successfully when criteria met", async () => {
    // Create an assignment
    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    }).save();

    // Create submissions
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: false,
      hintUsed: true,
    };

    const newSubmission2 = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: false,
      hintUsed: true,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const response2 = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission2)
      .expect(201);

    // Awarded badges from first response
    const awardedBadges = response.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "Perseverance Pro")
    ).toBe(false);

    // Awarded badges from second response
    const awardedBadges2 = response2.body["awardedBadges"];
    expect(
      awardedBadges2.some((badge) => badge.badgeId.name === "Perseverance Pro")
    ).toBe(true);
  });

  test("is not awarded when user creates a third submission for the assignment", async () => {
    // Create an assignment
    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    }).save();

    // Create submissions
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: false,
      hintUsed: true,
    };

    const newSubmission2 = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: false,
      hintUsed: true,
    };

    const newSubmission3 = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: false,
      hintUsed: true,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const response2 = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission2)
      .expect(201);

    const response3 = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission3)
      .expect(201);

    // Awarded badges from first response
    const awardedBadges = response.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "Perseverance Pro")
    ).toBe(false);

    // Awarded badges from second response
    const awardedBadges2 = response2.body["awardedBadges"];
    expect(
      awardedBadges2.some((badge) => badge.badgeId.name === "Perseverance Pro")
    ).toBe(true);

    // Awarded badges from third response
    const awardedBadges3 = response3.body["awardedBadges"];
    expect(
      awardedBadges3.some((badge) => badge.badgeId.name === "Perseverance Pro")
    ).toBe(false);
  });
});

describe("Mastermind badge", () => {
  test("is awarded successfully when criteria met", async () => {
    // Create an assignment
    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    }).save();

    // Create a submission
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: false,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const awardedBadges = response.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "Mastermind")
    ).toBe(true);
  });

  test("is not awarded when criteria met for a second time", async () => {
    // Create an assignment
    const assignment = await new Assignment({
      assignmentName: "Test Assignment",
      quizId: quiz.id,
      classroomId: classroomObjects[0].id,
      dueDate: new Date(),
    }).save();

    // Create submissions
    const newSubmission = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: false,
    };

    const newSubmission2 = {
      assignment: assignment.id,
      timeToComplete: new Date(1000),
      mistakeMade: true,
      hintUsed: false,
    };

    const response = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission)
      .expect(201);

    const response2 = await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSubmission2)
      .expect(201);

    const awardedBadges = response2.body["awardedBadges"];
    expect(
      awardedBadges.some((badge) => badge.badgeId.name === "Mastermind")
    ).toBe(false);
  });
});
