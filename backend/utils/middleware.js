const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')



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

/*
const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')  
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
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
*/

const authenticateToken = async (request, response, next) => {
    const authHeader = request.headers['authorization']
    const token = authHeader.replace('bearer ', '')

    if (token === null) return response.status(401).json({ error: 'token invalid' })

    jwt.verify(token, config.SECRET, (err, user) => {
        if (err) return response.status(403).json({ error: 'token cannot be verified' })
        request.user = user
        next()
    })
}



module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    authenticateToken
}