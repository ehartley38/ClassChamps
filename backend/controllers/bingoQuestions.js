const { userExtractor } = require('../utils/middleware')
const bingoQuestionsRouter = require('express').Router()
const BingoQuestion = require('../models/bingoQuestion')
const User = require('../models/user')

bingoQuestionsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const bingoQuestion = new BingoQuestion({
        creator: [user._id],
        parentQuiz: [body.parentQuiz],
        question: body.question,
        answer: body.answer,
        hints: [body.hints]
    })
    
    try {
        // Add bingoQuestion document
        const savedBingoQuestion = await bingoQuestion.save()
        // Add bingoQuestion ID to parent quiz questions array
        

    } catch (err) {
        response.status(400).json(error)
    }

})

module.exports = bingoQuestionsRouter