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
  test("returns valid data", async () => {
    // Create two users
    const user2 = await new User(helper.initialUsers[0]).save();
    const user3 = await new User(helper.initialUsers[1]).save();

    //Log in the users
    const user2LoginRespose = await api.post("/api/login").send({
      username: "testuser1",
      password: "Password1",
    });
    const user3LoginRespose = await api.post("/api/login").send({
      username: "testuser2",
      password: "Password1",
    });

    const user2AccessToken = user2LoginRespose.body["accessToken"];
    const user3AccessToken = user3LoginRespose.body["accessToken"];

    // Add them to the class
    const classroom = await Classroom.findById(classroomObjects[0].id);
    classroom.students.push(user2._id);
    classroom.students.push(user3._id);
    await classroom.save();

    // Create an assignment
    const assignment = await api
      .post("/api/assignments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        assignmentName: "Test Assignment",
        quizId: quiz.id,
        classroomId: classroomObjects[0].id,
        dueDate: new Date(),
      })
      .expect(201);

    // Have the users complete complete the assignment
    // User 2 submission
    const newSubmission2 = {
      assignment: assignment.body["id"],
      timeToComplete: new Date(10000),
      displayOnLeaderboard: true,
    };

    // User 3 first submission
    const newSubmission3 = {
      assignment: assignment.body["id"],
      timeToComplete: new Date(20000),
      displayOnLeaderboard: true,
    };

    // User 3 second submission
    const newSubmission4 = {
      assignment: assignment.body["id"],
      timeToComplete: new Date(30000),
      displayOnLeaderboard: false,
    };

    // User 2 submission
    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${user2AccessToken}`)
      .send(newSubmission2)
      .expect(201);

    // User 3 first submission
    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${user3AccessToken}`)
      .send(newSubmission3)
      .expect(201);

    // User 3 second submission
    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${user3AccessToken}`)
      .send(newSubmission4)
      .expect(201);

    // Check that the leaderboard data is correct
    const leaderboardData = await api
      .get(`/api/assignments/leaderboard/${assignment.body["id"]}`)
      .set("Authorization", `Bearer ${user2AccessToken}`);

    expect(leaderboardData.body).toHaveLength(2);
    expect(leaderboardData.body[0]["submission"]["student"]).toBe("testuser1");
  });
  test("excludes students who have opted out", async () => {
    // Create two users
    const user2 = await new User(helper.initialUsers[0]).save();
    const user3 = await new User(helper.initialUsers[1]).save();

    //Log in the users
    const user2LoginRespose = await api.post("/api/login").send({
      username: "testuser1",
      password: "Password1",
    });
    const user3LoginRespose = await api.post("/api/login").send({
      username: "testuser2",
      password: "Password1",
    });

    const user2AccessToken = user2LoginRespose.body["accessToken"];
    const user3AccessToken = user3LoginRespose.body["accessToken"];

    // Add them to the class
    const classroom = await Classroom.findById(classroomObjects[0].id);
    classroom.students.push(user2._id);
    classroom.students.push(user3._id);
    await classroom.save();

    // Create an assignment
    const assignment = await api
      .post("/api/assignments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        assignmentName: "Test Assignment",
        quizId: quiz.id,
        classroomId: classroomObjects[0].id,
        dueDate: new Date(),
      })
      .expect(201);

    // Have the users complete complete the assignment
    // User 2 submission
    const newSubmission2 = {
      assignment: assignment.body["id"],
      timeToComplete: new Date(10000),
      displayOnLeaderboard: true,
    };

    // User 3 submission (opted out)
    const newSubmission3 = {
      assignment: assignment.body["id"],
      timeToComplete: new Date(20000),
      displayOnLeaderboard: false,
    };

    // User 2 submission
    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${user2AccessToken}`)
      .send(newSubmission2)
      .expect(201);

    // User 3 first submission
    await api
      .post("/api/assignmentSubmissions")
      .set("Authorization", `Bearer ${user3AccessToken}`)
      .send(newSubmission3)
      .expect(201);

    // Check that the leaderboard data does not include the user who opted out
    const leaderboardData = await api
      .get(`/api/assignments/leaderboard/${assignment.body["id"]}`)
      .set("Authorization", `Bearer ${user2AccessToken}`);

    expect(leaderboardData.body).toHaveLength(1);
    expect(leaderboardData.body[0]["submission"]["student"]).toBe("testuser1");
  });

  test("fails if the assignment does not exist", async () => {
    const response = await api
      .get(`/api/assignments/leaderboard/63fcf1bddfe6c42656baf4e2`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);
  });
});
