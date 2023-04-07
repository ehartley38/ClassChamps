const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

//USED
// Get user info
usersRouter.get("/id", async (request, response) => {
  const user = request.user;
  const id = request.user._id;

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
  response.json(userObject);
});

module.exports = usersRouter;
