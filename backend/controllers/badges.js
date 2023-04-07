const Badge = require("../models/badge");

const badgesRouter = require("express").Router();

// Create a new badge
badgesRouter.post("/", async (request, response) => {
  const body = request.body;

  const badge = new Badge({
    name: body.name,
    description: body.description,
  });

  try {
    const savedBadge = await badge.save();
    response.status(201).json(savedBadge);
  } catch (err) {
    response.status(400).json(err);
  }
});

// USED
badgesRouter.get("/", async (request, response) => {
  const badges = await Badge.find({});
  response.json(badges);
});

module.exports = badgesRouter;
