const { userExtractor } = require("../utils/middleware");
const quizzesRouter = require("express").Router();
const Quiz = require("../models/quiz");
const BingoQuestion = require("../models/bingoQuestion");
const Assignment = require("../models/assignment");

// USED
quizzesRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const quiz = new Quiz({
    creator: [user.id],
    quizName: body.quizName,
    questions: [],
    quizType: body.quizType,
  });

  try {
    // Save quiz document
    const savedQuiz = await quiz.save();
    // Add quiz ID to users quiz array
    user.quizzes = user.quizzes.concat(savedQuiz.id);
    await user.save();

    response.status(201).json(savedQuiz);
  } catch (err) {
    console.log(err);
    response.status(400).json(err);
  }
});

// USED
quizzesRouter.get("/", userExtractor, async (request, response) => {
  const user = request.user;
  const quizzes = await Quiz.find({ creator: user._id });

  response.json(quizzes);
});

// USED
quizzesRouter.delete("/:id", userExtractor, async (request, response) => {
  // Eventually will need to delete from associated classroom + any set homework etc.

  const user = request.user;
  const quizId = request.params.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (quiz.creator.includes(user._id)) {
      // First remove the quiz
      await Quiz.findByIdAndRemove(quizId);

      // Remove the quiz id reference in user.quizzes
      user.quizzes.pull(quizId);
      await user.save();

      // Delete any assignments which use this quiz
      await Assignment.deleteMany({ quizId: quizId });

      // Remove all questions where the parentQuiz contains  the quiz id
      if (quiz.quizType === "Bingo") {
        await BingoQuestion.deleteMany({ parentQuiz: quizId });
      } else {
        console.log(
          "Need to implement delete functionality for this new quiz type!"
        );
      }

      response.status(204).end();
    } else {
      response.status(401).end();
    }
  } catch (err) {
    response.status(400).end();
  }
});

module.exports = quizzesRouter;
