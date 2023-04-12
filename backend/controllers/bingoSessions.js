const bingoSessionsRouter = require("express").Router();
const BingoSession = require("../models/bingoSession");

// USED
// Create a bingo session
bingoSessionsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;

  timeNow = new Date();

  const bingoSession = new BingoSession({
    assignment: body.assignment,
    student: user.id,
    questions: body.questions,
    startTime: timeNow,
  });

  try {
    const savedBingoSession = await bingoSession.save();
    response.status(201).json(savedBingoSession);
  } catch (err) {
    response.status(400).json(err);
  }
});

// USED
// Get a users bingo session
bingoSessionsRouter.get("/", async (request, response) => {
  const user = request.user;

  try {
    const bingoSessions = await BingoSession.find({ student: user.id });
    response.status(200).json(bingoSessions);
  } catch (err) {
    response.status(400).json(err);
  }
});

// USED
// Update questions array with new isCorrect value
bingoSessionsRouter.post(
  "/updateIsCorrect/:sessionId",
  async (request, response) => {
    const user = request.user;
    const body = request.body;
    const sessionId = request.params.sessionId;

    try {
      const session = await BingoSession.findById(sessionId);
      if (session.student.equals(user.id)) {
        await BingoSession.findOneAndUpdate(
          { _id: sessionId },
          {
            questions: body.questionsArray,
            mistakeMade: body.mistakeMade,
            hintUsed: body.hintUsed,
          }
        );
        response.status(200).json({ message: "Session updated" });
      } else {
        response.status(400).json({ message: "Invalid student" });
      }
    } catch (err) {
      console.log(err);
    }
  }
);

// USED
bingoSessionsRouter.delete("/:sessionId", async (request, response) => {
  const user = request.user;
  const sessionId = request.params.sessionId;

  try {
    const session = await BingoSession.findById(sessionId);
    if (session.student.equals(user.id)) {
      await BingoSession.deleteOne({ _id: sessionId });
      response.status(204).end();
    } else {
      response.status(400).json({ message: "Student not part of session" });
    }
  } catch (err) {
    response.status(400).end();
  }
});

module.exports = bingoSessionsRouter;
