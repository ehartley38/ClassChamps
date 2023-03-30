const { userExtractor } = require("../utils/middleware");
const assignmentRouter = require("express").Router();
const Assignment = require("../models/assignment");
const Classroom = require("../models/classroom");
const AssignmentSubmission = require("../models/assignmentSubmission");
const User = require("../models/user");
const mongoose = require("mongoose");

// Create a new assignment
assignmentRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const assignment = new Assignment({
    assignmentName: body.assignmentName,
    quizId: body.quizId,
    classroomId: body.classroomId,
    dueDate: body.dueDate,
  });

  try {
    const classroom = await Classroom.findById(body.classroomId);
    if (classroom.owners.includes(user._id)) {
      const savedAssignment = await assignment.save();

      classroom.assignmentIds.push(savedAssignment.id);
      await classroom.save();

      response.status(201).json(savedAssignment);
    } else {
      response.status(401).end();
    }
  } catch (err) {
    response.status(400).json(err);
  }
});

// Get all assignments for a given classroom
assignmentRouter.get(
  "/classroom/:classroomId",
  userExtractor,
  async (request, response) => {
    const user = request.user;
    const classroomId = request.params.classroomId;
    const assignments = await Assignment.find({
      classroomId: classroomId,
    })
      .populate("quizId", "quizType")
      .sort({ dueDate: 1 });

    response.json(assignments);
  }
);

// Get all due assignments for a provided classroom
assignmentRouter.get(
  "/classroom/:classroomId/due",
  userExtractor,
  async (request, response) => {
    const user = request.user;
    const classroomId = request.params.classroomId;

    // Get all due assignents
    const dueAssignments = await Assignment.find({
      classroomId: classroomId,
      dueDate: { $lt: new Date() },
    });

    response.json(dueAssignments);
  }
);

// Get leaderboard data for a given assignment
assignmentRouter.get(
  "/leaderboard/:assignmentId",
  userExtractor,
  async (request, response) => {
    const user = request.user;
    const assignmentId = request.params.assignmentId;

    AssignmentSubmission.aggregate([
      // Find all submissions, sort by time, then group by student, and select
      // the first document in each group
      {
        $match: {
          assignment: mongoose.Types.ObjectId(assignmentId),
          displayOnLeaderboard: true,
        },
      },
      { $sort: { timeToComplete: 1 } },
      {
        $group: {
          _id: "$student",
          submission: { $first: "$$ROOT" },
        },
      },
      // Sort by timeToComplete within each group
      { $sort: { "submission.timeToComplete": 1 } },
      // Lookup to perform a join query betwen AssignmentSubmission and User collection
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $project: {
          "submission.student": "$student.username",
          "submission.timeToComplete": 1,
        },
      },
    ]).exec((err, submissions) => {
      if (err) {
        console.log(err);
        return;
      }
      response.json(submissions);
    });
  }
);

module.exports = assignmentRouter;
