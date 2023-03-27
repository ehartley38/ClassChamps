const awardedBadgesRouter = require('express').Router()
const AwardedBadge = require('../models/awardedBadge')
const { userExtractor } = require('../utils/middleware')

awardedBadgesRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user


    // const awardedBadge = new AwardedBadge({
    //     studentId: user.id,
    // })
})


module.exports = awardedBadgesRouter