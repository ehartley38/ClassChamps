const { userExtractor } = require('../utils/middleware')
const quizzesRouter = require('express').Router()
const Quiz = require('../models/Quiz')
const User = require('../models/user')


quizzesRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const quiz = new Quiz({
        creator: [user._id],
        questions: body.questions,
        optional: body.optional,
        //createDate: 'current time',
        //dueDate: 'due date',
        quizType: body.quizType
    })

    try {
        // Save quiz document
        const savedQuiz = await Quiz.save()
        // Add quiz ID to users quiz array
        user.quizzes = user.quizzes.concat(savedQuiz._id)
        await user.save()

        response.status(201).json(savedQuiz)
    } catch (err) {
        response.status(400).json(err)
    }
})

module.exports = quizzesRouter