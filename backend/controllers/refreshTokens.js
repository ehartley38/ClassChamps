const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const refreshTokensRouter = require("express").Router();

refreshTokensRouter.get("/", async (request, response) => {
  const cookies = request.cookies;
  if (!cookies?.jwt) return response.sendStatus(401);
  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken });
  if (!user) return response.sendStatus(403);

  jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.username !== decoded.username)
      return response.sendStatus(403);
    const roles = Object.values(user.roles);
    const userForToken = {
      username: decoded.username,
      id: user.id,
    };
    const accessToken = jwt.sign(userForToken, config.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    response.json({ roles, accessToken });
  });
});

module.exports = refreshTokensRouter;
