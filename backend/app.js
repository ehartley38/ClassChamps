const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const logger = require("./utils/logger");
const cookieParser = require("cookie-parser");

// Routers
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const classroomsRouter = require("./controllers/classrooms");
const bingoQuestionsRouter = require("./controllers/bingoQuestions");
const quizzesRouter = require("./controllers/quizzes");
const assignmentRouter = require("./controllers/assignments");
const bingoSessionsRouter = require("./controllers/bingoSessions");
const assignmentSubmissionsRouter = require("./controllers/assignmentSubmissions");
const badgesRouter = require("./controllers/badges");
const awardedBadgesRouter = require("./controllers/awardedBadges");
const refreshTokensRouter = require("./controllers/refreshTokens");

const middleware = require("./utils/middleware");
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

// Add this before CORS
app.use(middleware.credentials);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(middleware.requestLogger);
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/classrooms", classroomsRouter);
app.use("/api/bingoQuestions", bingoQuestionsRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/bingoSessions", bingoSessionsRouter);
app.use("/api/assignmentSubmissions", assignmentSubmissionsRouter);
app.use("/api/badges", badgesRouter);
app.use("/api/awardedBadges", awardedBadgesRouter);
app.use("/api/refreshTokens", refreshTokensRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
app.use(middleware.userExtractor);

module.exports = app;
