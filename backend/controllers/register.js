const bcrypt = require("bcrypt");
const User = require("../models/user");
const registerRouter = require("express").Router();

registerRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !name || !password) {
    return response
      .status(400)
      .json({ message: "Missing registration details" });
  }

  const duplicateUsername = await User.findOne({ username: username });
  if (duplicateUsername) {
    return response.status(409).json({ message: "Username already taken" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    return response.status(201).json(savedUser);
  } catch (err) {
    return response.status(500).json({ message: "User registration failed" }); // User registration failed
  }
});

module.exports = registerRouter;
