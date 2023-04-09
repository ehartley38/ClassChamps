const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

//USED
// Get user info
usersRouter.get("/id", async (request, response) => {
  const user = request.user;
  const id = request.user._id;
  try {
    const userObject = await User.findById(id)
      .populate("classrooms")
      .populate({
        path: "awardedBadgeIds",
        populate: {
          path: "badgeId",
          model: "Badge",
        },
      })
      .exec();
    response.status(200).json(userObject).end();
  } catch (err) {
    response.status(401).end();
  }
});

module.exports = usersRouter;
