
const roomCodesRouter = require('express').Router()
const RoomCode = require('../models/roomCode')
const { userExtractor } = require('../utils/middleware')

roomCodesRouter.get('/generate', userExtractor, async (request, response) => {
    const user = request.user
    
})

module.exports = roomCodesRouter