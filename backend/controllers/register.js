const bcrypt = require("bcrypt");
const User = require("../models/user");
const registerRouter = require("express").Router();

registerRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (err) {
    console.log("error");

    response.status(400);
  }
});

module.exports = registerRouter;
