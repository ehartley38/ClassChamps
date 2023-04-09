const User = require("../models/user");
const Classroom = require("../models/classroom");

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const classroomsInDb = async () => {
  const classrooms = await Classroom.find({});
  return classrooms.map((c) => c.toJSON());
};

const initialUsers = [
  {
    _id: "63fcf1bddfe6c42656baf4e2",
    username: "testuser1",
    name: "Jimmy",
    passwordHash:
      "$2b$10$MrHTLOWAbq/NRIIKIFSib.fv2VTy2btSIqE4OeD244sB3Z5l1Sn.6",
  },
  {
    _id: "63fcf1bddfe6c42656baf4e3",
    username: "testuser2",
    name: "Sally",
    passwordHash:
      "$2b$10$MrHTLOWAbq/NRIIKIFSib.fv2VTy2btSIqE4OeD244sB3Z5l1Sn.6",
  },
  {
    _id: "63fcf1bddfe6c42656baf4e4",
    username: "testuser3",
    name: "Bob",
    passwordHash:
      "$2b$10$MrHTLOWAbq/NRIIKIFSib.fv2VTy2btSIqE4OeD244sB3Z5l1Sn.6",
  },
];

const initialTeachers = [
  {
    _id: "642aaeb1f8ef7be310dadec4",
    username: "testteacher1",
    name: "Billy",
    passwordHash:
      "$2b$10$MrHTLOWAbq/NRIIKIFSib.fv2VTy2btSIqE4OeD244sB3Z5l1Sn.6",
    roles: {
      Student: 2000,
      Teacher: 3000,
    },
  },
  {
    _id: "642aaeb1f8ef7be310dadec5",
    username: "testteacher2",
    name: "Sue",
    passwordHash:
      "$2b$10$MrHTLOWAbq/NRIIKIFSib.fv2VTy2btSIqE4OeD244sB3Z5l1Sn.6",
    roles: {
      Student: 2000,
      Teacher: 3000,
    },
  },
];

const generateTeachersInitialClassrooms = (teacherId) => {
  const studentId = "63fcf1bddfe6c42656baf4e2";

  const initialClassrooms = [
    // Classrooms with owners
    {
      _id: "5f9f1b9b9c9d440000a1b0f0",
      owners: [teacherId],
      quizzes: [],
      roomName: "Test Classroom 0",
      students: [studentId],
      roomCode: "",
    },
    {
      _id: "5f9f1b9b9c9d440000a1b0f1",
      owners: [teacherId],
      quizzes: [],
      roomName: "Test Classroom 1",
      students: [studentId],
      roomCode: "",
    },
    {
      _id: "5f9f1b9b9c9d440000a1b0f2",
      owners: [teacherId],
      quizzes: [],
      roomName: "Test Classroom 2",
      students: [studentId],
      roomCode: "",
    },
    // Classroom with no owner
    {
      _id: "5f9f1b9b9c9d440000a1b0f3",
      owners: [],
      quizzes: [],
      roomName: "Test Classroom 3",
      students: [],
      roomCode: "",
    },
  ];

  return initialClassrooms;
};

const generateStudentsInitialClassrooms = (studentId) => {
  const teacherId = "63fcf1bddfe6c42656baf4e2";

  const initialClassrooms = [
    // Classrooms with owners
    {
      _id: "5f9f1b9b9c9d440000a1b0f0",
      owners: [teacherId],
      quizzes: [],
      roomName: "Test Classroom 0",
      students: [studentId],
      roomCode: "",
    },
    {
      _id: "5f9f1b9b9c9d440000a1b0f1",
      owners: [teacherId],
      quizzes: [],
      roomName: "Test Classroom 1",
      students: [studentId],
      roomCode: "",
    },
    {
      _id: "5f9f1b9b9c9d440000a1b0f2",
      owners: [teacherId],
      quizzes: [],
      roomName: "Test Classroom 2",
      students: [studentId],
      roomCode: "",
    },
    // Classroom with no owner or students
    {
      _id: "5f9f1b9b9c9d440000a1b0f3",
      owners: [],
      quizzes: [],
      roomName: "Test Classroom 3",
      students: [],
      roomCode: "123ABC",
    },
  ];

  return initialClassrooms;
};

// Count the number of classroms that have a owner with the given id
const countClassroomsWithTeacher = async (teacherId, classrooms) => {
  let count = 0;
  for (let i = 0; i < classrooms.length; i++) {
    if (classrooms[i].owners.includes(teacherId)) {
      count++;
    }
  }
  return count;
};

const generateBingoQuestions = (quizId) => {
  const questions = [
    {
      parentQuiz: quizId,
      question: "Test Question1",
      answer: "Test Answer1",
      hint: "Test Hint1",
    },
    {
      parentQuiz: quizId,
      question: "Test Question2",
      answer: "Test Answer2",
      hint: "Test Hint2",
    },
    {
      parentQuiz: quizId,
      question: "Test Question3",
      answer: "Test Answer3",
      hint: "Test Hint3",
    },
  ];

  return questions;
};

module.exports = {
  usersInDb,
  classroomsInDb,
  generateTeachersInitialClassrooms,
  countClassroomsWithTeacher,
  generateStudentsInitialClassrooms,
  initialUsers,
  initialTeachers,
  generateBingoQuestions,
};
