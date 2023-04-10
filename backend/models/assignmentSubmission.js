const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
  },
  student: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  submissionDate: Date,
  timeToComplete: Date,
  displayOnLeaderboard: {
    type: Boolean,
    default: false,
  },
  mistakeMade: {
    type: Boolean,
    default: false,
  },
  hintUsed: {
    type: Boolean,
    default: false,
  },
});

assignmentSubmissionSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);

module.exports = AssignmentSubmission;
