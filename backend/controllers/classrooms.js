const { userExtractor } = require('../utils/middleware')
const classroomsRouter = require('express').Router()
const Classroom = require('../models/classroom')

let toolFile = require('../utils/tools')

classroomsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    const user = request.user

    const classroom = new Classroom({
        owners: [user._id],
        roomName: body.roomName
    })

    // Add the classroom document here
    const savedClassroom = await classroom.save()
    // And the classroom reference in the user document here
    user.classrooms = user.classrooms.concat(savedClassroom._id)
    await user.save()

    response.json(savedClassroom)
})

classroomsRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user
    const classrooms = await Classroom.find({ owners: user._id })

    response.json(classrooms)
})

classroomsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user

    const classroom = await Classroom.findById(request.params.id)
    if (classroom.owners.includes(user._id)) {
        await Classroom.findByIdAndRemove(request.params.id)
        user.classrooms.pull(request.params.id)
        await user.save()
    }

    response.status(204).end()

})

classroomsRouter.put('/:id/generate-code', userExtractor, async (request, response) => {
    const user = request.user
    const body = request.body
    const ownersArray = Object.values(body.owners)
    
    if (ownersArray.includes(user.id)) {
        let unique = false
        while (unique === false) {
            let code = toolFile.generateCode(6)
    
            try {
                const updatedClassroom = await Classroom.findOneAndUpdate(body.id, { roomCode: code }, { new: true })
                unique = true
                response.json(updatedClassroom)
            } catch (err) {
                console.log(err);
            }
    
        }
    }
})




module.exports = classroomsRouter