const bingoQuestionsRouter = require("express").Router();
const BingoQuestion = require("../models/bingoQuestion");
const Quiz = require("../models/Quiz");

// Add a single question
bingoQuestionsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;

  const bingoQuestion = new BingoQuestion({
    creator: [user.id],
    parentQuiz: [body.parentQuiz],
    question: body.question,
    answer: body.answer,
    hint: body.hint,
  });

  try {
    // Add bingoQuestion document
    const savedBingoQuestion = await bingoQuestion.save();

    // Add bingoQuestion ID reference to parent quiz questions array
    const quiz = await Quiz.findById(body.parentQuiz);

    quiz.questions = quiz.questions.concat(savedBingoQuestion.id);
    await quiz.save();

    response.status(201);
  } catch (err) {
    response.status(400).json(err);
  }
});

// USED
// Add an array of questions
bingoQuestionsRouter.post("/addAllQuestions", async (request, response) => {
  const body = request.body;
  const user = request.user;

  try {
    // Take the parentQuiz ID from the first object and use it to
    // add the bingoQuestion ID reference to parentQuiz questions array
    const quiz = await Quiz.findById(body[0].parentQuiz);

    if (!quiz) {
      console.log("No quiz");
      response.status(400);
      return;
    }

    for (const question of body) {
      const bingoQuestion = new BingoQuestion({
        creator: [user.id],
        parentQuiz: [question.parentQuiz],
        question: question.question,
        answer: question.answer,
        hint: question.hint,
      });

      // Save the bingoQuestion document
      const savedBingoQuestion = await bingoQuestion.save();

      // Push the question to its parent quiz questions array
      quiz.questions.push(savedBingoQuestion._id);
      await quiz.save();
    }
    response.status(201).json({ message: "All questions added" });
  } catch (err) {
    response.status(400).json(err);
  }
});

// USED
bingoQuestionsRouter.get("/getAllByQuiz/:quizId", async (request, response) => {
  const quizId = request.params.quizId;
  const user = request.user;

  try {
    const questions = await BingoQuestion.find({ parentQuiz: quizId });

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let shuffledQuestions = questions
      .map((q) => ({ q, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ q }) => q);

    response.json(shuffledQuestions);
  } catch (err) {
    console.log(err);
    response.status(400).json(err);
  }
});

module.exports = bingoQuestionsRouter;
