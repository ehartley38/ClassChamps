const { userExtractor } = require('../utils/middleware')
const assignmentSubmissionsRouter = require('express').Router()
const AssignmentSubmission = require('../models/assignmentSubmission')

assignmentSubmissionsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    timeNow = new Date()

    const submission = new AssignmentSubmission({
        assignment: body.assignment,
        student: user.id,
        submissionDate: timeNow,
        timeToComplete: body.timeToComplete
    })

    try {
        const savedSubmission = await submission.save()
        response.status(201).json(savedSubmission)
    } catch (err) {
        response.status(400).json(err)
    }
})

// Get all sumbissions for a given user
assignmentSubmissionsRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user
    
    try {
        const submissions = await AssignmentSubmission.find({ student: user.id }).populate('assignment', 'assignmentName')
        response.status(200).json(submissions)
    } catch (err) {
        response.status(400).json(err)
    }

})


module.exports = assignmentSubmissionsRouter