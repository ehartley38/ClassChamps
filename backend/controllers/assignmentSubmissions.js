const { userExtractor } = require('../utils/middleware')
const assignmentSubmissionsRouter = require('express').Router()
const AssignmentSubmission = require('../models/assignmentSubmission')

// Create a new submission and handle xp gains
assignmentSubmissionsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    timeNow = new Date()

    const submission = new AssignmentSubmission({
        assignment: body.assignment,
        student: user.id,
        submissionDate: timeNow,
        timeToComplete: body.timeToComplete,
        displayOnLeaderboard: body.displayOnLeaderboard
    })

    try {
        const savedSubmission = await submission.save()
        response.status(201).json(savedSubmission)
    } catch (err) {
        response.status(400).json(err)
    }

    const submissions = await AssignmentSubmission.find({ student: user.id, assignment: body.assignment })
    console.log('all submits', submissions);

})

// Get all sumbissions for a given user
assignmentSubmissionsRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user

    try {
        const submissions = await AssignmentSubmission.find({ student: user.id }).sort({ submissionDate: -1 }).populate('assignment', 'assignmentName')
        response.status(200).json(submissions)
    } catch (err) {
        response.status(400).json(err)
    }

})

// Get all submissions for all users for a given assignment
assignmentSubmissionsRouter.get('/:assignmentId', userExtractor, async (request, response) => {
    const assignmentId = request.params.assignmentId

    try {
        const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
        response.status(200).json(submissions)
    } catch (err) {
        response.status(400).json(err)
    }
})

module.exports = assignmentSubmissionsRouter