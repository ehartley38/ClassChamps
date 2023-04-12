const assignmentRouter = require("express").Router();
const Assignment = require("../models/assignment");
const Classroom = require("../models/classroom");
const AssignmentSubmission = require("../models/assignmentSubmission");
const User = require("../models/user");
const mongoose = require("mongoose");

// USED
// Create a new assignment
assignmentRouter.post("/", async (request, response) => {
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

// USED
// Get all assignments for a given classroom
assignmentRouter.get("/classroom/:classroomId", async (request, response) => {
  const user = request.user;
  const classroomId = request.params.classroomId;
  try {
    const assignments = await Assignment.find({
      classroomId: classroomId,
    })
      .populate("quizId", "quizType")
      .sort({ dueDate: 1 });

    response.status(200).json(assignments);
  } catch (err) {
    response.status(400).json(err);
  }
});

// Get all due assignments for a provided classroom
assignmentRouter.get(
  "/classroom/:classroomId/due",
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

// USED
// Get leaderboard data for a given assignment
assignmentRouter.get(
  "/leaderboard/:assignmentId",
  async (request, response) => {
    const user = request.user;
    const assignmentId = request.params.assignmentId;

    // Check if assignment with given ID exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return response.status(400).end();
    }

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
        response.status(400).end();
        return;
      }
      response.status(201).json(submissions).end();
    });
  }
);

module.exports = assignmentRouter;
