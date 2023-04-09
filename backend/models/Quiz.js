const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  creator: [
    {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  quizName: {
    required: true,
    type: String,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BingoQuestion",
    },
  ],
  quizType: {
    required: true,
    type: String,
    enum: {
      values: ["Bingo", "MultiChoice"],
    },
  },
});

QuizSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;
