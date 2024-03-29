const logger = require("./logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");
const AssignmentSubmission = require("../models/assignmentSubmission");
const Assignment = require("../models/assignment");
const AwardedBadge = require("../models/awardedBadge");

const WEEKMS = 604800000;

const credentials = (request, response, next) => {
  const origin = request.headers.origin || request.headers.referer;

  if (config.allowedOrigins.includes(origin)) {
    console.log("Origin allowed");
    response.header("Access-Control-Allow-Credentials", true);
  }
  // response.header("Access-Control-Allow-Credentials", true);

  next();
};

// Log details of each request to the console
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const verifyJWT = (request, response, next) => {
  const authHeader =
    request.headers.authorization || request.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return response.sendStatus(401);
  const token = authHeader.split(" ")[1];
  // console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return response.sendStatus(403); //invalid token
    const user = await User.findById(decoded.id).populate("awardedBadgeIds");
    if (!user) {
      return response.status(403).json({ error: "user invalid" });
    }
    request.user = user;

    next();
  });
};

// Check if user meets criteria for badges that are related to submitting assignments
const checkBadges = async (request, response, next) => {
  const user = request.user;
  const body = request.body;
  const userAwardedBadges = user.awardedBadgeIds;

  const badgeIds = [
    "641da25595a6c2ad1c5fd67c",
    "641da2af95a6c2ad1c5fd67e",
    "641da2e095a6c2ad1c5fd680",
    "641da30f95a6c2ad1c5fd684",
    "641da32b95a6c2ad1c5fd686",
  ];

  const badgeXp = {
    "641da25595a6c2ad1c5fd67c": 50, // First steps
    "641da2af95a6c2ad1c5fd67e": 100, // Early bird
    "641da2e095a6c2ad1c5fd680": 100, // Bingo Genius
    "641da30f95a6c2ad1c5fd684": 50, // Perseverance Pro
    "641da32b95a6c2ad1c5fd686": 50, // Mastermind
  };

  const badgesToBeAwarded = [];
  let totalBadgeXp = 0;
  // Used for loop instead of forEach because of
  // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  // Loop through all existing badge ids
  badgeIdLoop: for (let i = 0; i < badgeIds.length; i++) {
    const existingBadgeId = badgeIds[i];

    // Check if user already has badge and awarded is true, then skip to next badge
    for (let j = 0; j < userAwardedBadges.length; j++) {
      const userBadgeId = userAwardedBadges[j]?.badgeId;
      const awarded = userAwardedBadges[j]?.awarded;
      if (
        userBadgeId &&
        userBadgeId.toString() === existingBadgeId &&
        awarded
      ) {
        continue badgeIdLoop;
      }
    }

    // Switch statement to check if user meets criteria for badges
    switch (existingBadgeId) {
      // First Steps
      case "641da25595a6c2ad1c5fd67c":
        try {
          const submissions = await AssignmentSubmission.find({
            student: user.id,
          });
          if (submissions.length === 0) {
            badgesToBeAwarded.push(existingBadgeId);
            user.experiencePoints += badgeXp[existingBadgeId];
            totalBadgeXp += badgeXp[existingBadgeId];
          }
        } catch (err) {
          console.log(err);
        }
        break;

      // Early Bird
      case "641da2af95a6c2ad1c5fd67e":
        try {
          const submissionDate = new Date();
          const assignment = await Assignment.find({ _id: body.assignment });
          if (
            assignment[0].dueDate.getTime() - submissionDate.getTime() >
            WEEKMS
          ) {
            badgesToBeAwarded.push(existingBadgeId);
            user.experiencePoints += badgeXp[existingBadgeId];
            totalBadgeXp += badgeXp[existingBadgeId];
          }
        } catch (err) {
          console.log(err);
        }
        break;

      // Bingo Genius
      case "641da2e095a6c2ad1c5fd680":
        if (body.mistakeMade === false) {
          badgesToBeAwarded.push(existingBadgeId);
          user.experiencePoints += badgeXp[existingBadgeId];
          totalBadgeXp += badgeXp[existingBadgeId];
        }
        break;

      // Perseverance Pro
      case "641da30f95a6c2ad1c5fd684":
        const submissions = await AssignmentSubmission.find({
          student: user.id,
          assignment: body.assignment,
        });
        if (submissions.length === 1) {
          badgesToBeAwarded.push(existingBadgeId);
          user.experiencePoints += badgeXp[existingBadgeId];
          totalBadgeXp += badgeXp[existingBadgeId];
        }
        break;

      // Mastermind
      case "641da32b95a6c2ad1c5fd686":
        if (body.hintUsed === false) {
          badgesToBeAwarded.push(existingBadgeId);
          user.experiencePoints += badgeXp[existingBadgeId];
          totalBadgeXp += badgeXp[existingBadgeId];
        }
        break;
    }
  }

  // Loop through all badgesToBeAwarded and create awardedBadge
  const awardedBadges = [];
  for (let i = 0; i < badgesToBeAwarded.length; i++) {
    const badgeId = badgesToBeAwarded[i];

    const awardedBadge = new AwardedBadge({
      studentId: user.id,
      badgeId: badgeId,
      awarded: true,
      awardedDate: new Date(),
    });

    try {
      const savedAwardedBadge = await awardedBadge.save();
      user.awardedBadgeIds.push(awardedBadge.id);
      const populatedAwardedBadge = await savedAwardedBadge.populate("badgeId");
      awardedBadges.push(populatedAwardedBadge);
    } catch (err) {
      console.log(err);
    }
  }
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }

  request.totalBadgeXp = totalBadgeXp;
  response.awardedBadges = awardedBadges;

  next();
};

module.exports = {
  requestLogger,
  checkBadges,
  credentials,
  verifyJWT,
};
