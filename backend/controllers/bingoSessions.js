const { userExtractor } = require('../utils/middleware')
const bingoSessionsRouter = require('express').Router()
const BingoSession = require('../models/bingoSession')

// Create a bingo session
bingoSessionsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    timeNow = new Date()

    const bingoSession = new BingoSession({
        assignment: body.assignment,
        student: user.id,
        questions: body.questions,
        startTime: timeNow
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

// Update questions array with new isCorrect value
bingoSessionsRouter.post('/updateIsCorrect/:sessionId', userExtractor, async (request, response) => {
    const user = request.user
    const body = request.body
    const sessionId = request.params.sessionId

    //console.log('body questions is', body.questionsArray);

    try {
        const session = await BingoSession.findById(sessionId)
        if (session.student.equals(user.id)) {
            //console.log('Updating questions');
            await BingoSession.findOneAndUpdate({ _id: sessionId}, {questions: body.questionsArray})
            response.status(200).json({message: 'Questions updated'})
        } else {
            response.status(400).json({message: 'Invalid student'})
        }
    } catch (err) {
        console.log(err);
    }
})


module.exports = bingoSessionsRouter