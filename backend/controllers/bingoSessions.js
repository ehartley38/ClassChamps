const { userExtractor } = require('../utils/middleware')
const bingoSessionsRouter = require('express').Router()
const BingoSession = require('../models/bingoSession')

// Create a bingo session
bingoSessionsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const bingoSession = new BingoSession({
        assignment: body.assignment,
        student: user.id,
        questions: body.questions
    })

    try {
        const savedBingoSession = await bingoSession.save()
        response.status(201).json(savedBingoSession)
    } catch (err) {
        response.status(400).json(err)
    }
})

// Get a users bingo session
bingoSessionsRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user

    try {
        const bingoSessions = await BingoSession.find({ student: user.id })
        response.status(200).json(bingoSessions)
    } catch (err) {
        response.status(400).json(err)
    }
})

module.exports = bingoSessionsRouter