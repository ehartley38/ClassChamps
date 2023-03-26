const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')
const AssignmentSubmission = require('../models/assignmentSubmission')
const Assignment = require('../models/assignment')
const AwardedBadge = require('../models/awardedBadge')

const WEEKMS = 604800000

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: 'token missing or invalid' })
    }

    next(error)
}


const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('bearer ')) {
        request.token = authorization.replace('bearer ', '')
    }

    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(401).json({ error: 'user invalid' })
    }
    request.user = user

    next()
}

// Check if user meets criteria for badges that are related to submitting assignments
const checkBadges = async (request, response, next) => {
    const user = request.user
    const body = request.body
    const userBadges = user.awardedBadgeIds


    const badgeIds = ['641da25595a6c2ad1c5fd67c', '641da2af95a6c2ad1c5fd67e', '641da2e095a6c2ad1c5fd680',
        '641da2f795a6c2ad1c5fd682', '641da30f95a6c2ad1c5fd684', '641da32b95a6c2ad1c5fd686']

    const badgesToBeAwarded = []
    // Used for loop instead of forEach because of
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    for (let i = 0; i < badgeIds.length; i++) {
        const id = badgeIds[i]

        if (userBadges.includes(id)) {
            return
        }
        switch (id) {
            // First Steps
            case '641da25595a6c2ad1c5fd67c':
                try {
                    const submissions = await AssignmentSubmission.find({ student: user.id })
                    if (submissions.length === 0) {
                        badgesToBeAwarded.push(id)
                    }
                } catch (err) {
                    console.log(err);
                }
                break

            // Early Bird
            case '641da2af95a6c2ad1c5fd67e':
                try {
                    const submissionDate = new Date()
                    const assignment = await Assignment.find({ _id: body.assignment })
                    if (assignment[0].dueDate.getTime() - submissionDate.getTime() > WEEKMS) {
                        badgesToBeAwarded.push(id)
                    }
                } catch (err) {
                    console.log(err);
                }
                break

            // Bingo Genius
            case '641da2e095a6c2ad1c5fd680':
                if (body.mistakeMade === false) {
                    badgesToBeAwarded.push(id)
                }
                break

            // Streak Master
            case '641da2f795a6c2ad1c5fd682':
                // First check if a student has already submitted this assignment. 
                // If so, this does not count toward the badge progress
                const submission = await AssignmentSubmission.findOne({ assignment: body.assignment, student: user.id })
                if (submission !== null) {
                    break
                }

                // Now check submission meets badge criteria
                let awardedBadge = await AwardedBadge.findOne({ badgeId: id, studentId: user.id })
                if (awardedBadge === null) {
                    const newAwardedBadge = new AwardedBadge({
                        studentId: user.id,
                        badgeId: id,
                        awarded: false,
                    })
                    await newAwardedBadge.save()
                    awardedBadge = await AwardedBadge.findOne({ badgeId: id, studentId: user.id })
                }

                const assignment = await Assignment.findOne({ _id: body.assignment })
                const submissionDate = new Date()

                // If submitted on time, then add one to badge criteria
                if (assignment.dueDate.getTime() > submissionDate.getTime()) {
                    awardedBadge.criteriaCount += 1
                    if (awardedBadge.criteriaCount === 5) {
                        awardedBadge.awarded = true
                        badgesToBeAwarded.push(id)
                    }

                    await awardedBadge.save()
                } else {
                    // Else reset criteria to zero
                    awardedBadge.criteriaCount = 0
                    await awardedBadge.save()
                }
                break

            // Perseverance Pro
            case '641da30f95a6c2ad1c5fd684':
                const submissions = await AssignmentSubmission.find({ student: user.id, assignment: body.assignment })
                if (submissions.length === 1) {
                    badgesToBeAwarded.push(id)
                }
                break

            // Mastermind
            case '641da32b95a6c2ad1c5fd686':
                if (body.hintUsed === false) {
                    badgesToBeAwarded.push(id)
                }
                break
        }
    }

    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userExtractor,
    checkBadges
}