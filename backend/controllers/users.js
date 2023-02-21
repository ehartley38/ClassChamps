const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})

  response.json(users)
})

usersRouter.get('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const id = user._id

  const userObject = await User.findById(id).populate('classrooms').exec()
  response.json(userObject)
}
)

module.exports = usersRouter