const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const roles = Object.values(user.roles).filter(Boolean);

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const accessToken = jwt.sign(userForToken, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });

  const refreshToken = jwt.sign(
    { username: user.username },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  // Save refresh token with current user
  user.refreshToken = refreshToken;
  await user.save();

  // Create secure cookie with refresh token
  response.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  response.status(200).send({ roles, accessToken });
});

module.exports = loginRouter;
