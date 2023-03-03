const { userExtractor } = require('../utils/middleware')
const quizzesRouter = require('express').Router()
const Quiz = require('../models/quiz')


quizzesRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const quiz = new Quiz({
        creator: [user.id],
        quizName: body.quizName,
        questions: [],
        quizType: body.quizType
    })

    try {
        // Save quiz document
        const savedQuiz = await quiz.save()
        // Add quiz ID to users quiz array
        user.quizzes = user.quizzes.concat(savedQuiz.id)
        await user.save()

        response.status(201).json(savedQuiz)
    } catch (err) {
        console.log(err);
        response.status(400).json(err)
    }
})

module.exports = quizzesRouter