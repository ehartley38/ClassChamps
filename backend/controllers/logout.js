const User = require("../models/user");

const logoutRouter = require("express").Router();

logoutRouter.get("/", async (request, response) => {
  console.log("Logging out user");
  const cookies = request.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    response.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return response.sendStatus(204);
  }

  user.refreshToken = "";
  await user.save();

  response.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  response.sendStatus(204);
});

module.exports = logoutRouter;
