const { checkBadges } = require("../utils/middleware");
const assignmentSubmissionsRouter = require("express").Router();
const AssignmentSubmission = require("../models/assignmentSubmission");
let toolFile = require("../utils/tools");

// USED
// Create a new submission and handle xp gains
assignmentSubmissionsRouter.post(
  "/",
  checkBadges,
  async (request, response) => {
    const body = request.body;
    const user = request.user;

    timeNow = new Date();

    const submission = new AssignmentSubmission({
      assignment: body.assignment,
      student: user.id,
      submissionDate: timeNow,
      timeToComplete: body.timeToComplete,
      displayOnLeaderboard: body.displayOnLeaderboard,
      mistakeMade: body.mistakeMade,
      hintUsed: body.hintUsed,
    });

    try {
      const savedSubmission = await submission.save();
    } catch (err) {
      console.log(err);
      response.status(400).json(err).end();
    }

    // Assign xp to student
    try {
      const submissions = await AssignmentSubmission.find({
        student: user.id,
        assignment: body.assignment,
      });
      const xpGain = toolFile.xpCalculator(submissions.length);
      user.experiencePoints += xpGain;
      await user.save();

      const totalXpGain = xpGain + request.totalBadgeXp;

      // Return the xp gained
      response
        .status(201)
        .json({ xpGain: totalXpGain, awardedBadges: response.awardedBadges });
    } catch (err) {
      response.status(400).end();
    }
  }
);

// USED
// Get all sumbissions for a given user
assignmentSubmissionsRouter.get("/", async (request, response) => {
  const user = request.user;

  try {
    const submissions = await AssignmentSubmission.find({ student: user.id })
      .sort({ submissionDate: -1 })
      .populate("assignment", "assignmentName");
    if (submissions.length > 0) {
      response.status(200).json(submissions).end();
    } else {
      response.status(204).end();
    }
  } catch (err) {
    response.status(400).end();
  }
});

// Get all submissions for all users for a given assignment
assignmentSubmissionsRouter.get("/:assignmentId", async (request, response) => {
  const assignmentId = request.params.assignmentId;

  try {
    const submissions = await AssignmentSubmission.find({
      assignment: assignmentId,
    });
    response.status(200).json(submissions);
  } catch (err) {
    response.status(400).json(err);
  }
});

module.exports = assignmentSubmissionsRouter;
