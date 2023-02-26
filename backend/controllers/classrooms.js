const { userExtractor } = require('../utils/middleware')
const classroomsRouter = require('express').Router()
const Classroom = require('../models/classroom')

let toolFile = require('../utils/tools')
const User = require('../models/user')

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

classroomsRouter.get('/teacherClassrooms', userExtractor, async (request, response) => {
    const user = request.user
    const classrooms = await Classroom.find({ owners: user._id })

    response.json(classrooms)
})

classroomsRouter.get('/studentClassrooms', userExtractor, async (request, response) => {
    const user = request.user
    const classrooms = await Classroom.find({ students: user._id })

    response.json(classrooms)
})

classroomsRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const classroom = await Classroom.findById(id).populate('students').exec()

    response.json(classroom)
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

// Generate a room code for a given classroom
classroomsRouter.put('/:id/generate-code', userExtractor, async (request, response) => {
    const user = request.user
    const body = request.body
    const ownersArray = Object.values(body.owners)

    if (ownersArray.includes(user.id)) {
        let unique = false
        while (unique === false) {
            let code = toolFile.generateCode(6)

            try {
                const updatedClassroom = await Classroom.findOneAndUpdate({ _id: body.id }, { roomCode: code }, { new: true })
                .populate('students')
                unique = true   
                response.json(updatedClassroom)
            } catch (err) {
                console.log(err);
            }

        }
    }
})

// Add the user to the classroom using the room code
classroomsRouter.put('/join', userExtractor, async (request, response) => {
    const user = request.user
    const code = request.body.roomCode

    try {
        const classroom = await Classroom.findOne({ roomCode: code })
        if (!classroom) {
            //throw new Error('Invalid classroom code')
            return response.status(404).send('Invalid room code')
        } else {
            if (classroom.students.includes(user.id)) {
                return response.status(200).json({ message: "User already registered in class" })
            }

            classroom.students = classroom.students.concat(user._id)
            user.classrooms = user.classrooms.concat(classroom._id)
            await classroom.save()
            await user.save()

            response.json(classroom)
        }
    } catch (err) {
        response.status(500).json({ message: "Internal server error" })
        console.log(err);
    }
})

// Remove a student from a class
classroomsRouter.put('/:classId/removeUser/:userId', userExtractor, async (request, response) => {
    const user = request.user
    const classId = request.params.classId
    const userId = request.params.userId
    const classroom = await Classroom.findById(classId)
    const student = await User.findById(userId)

    if (classroom.owners.includes(user._id)) {
        classroom.students.pull(userId)
        await classroom.save()

        student.classrooms.pull(classId)
        await student.save()
    }

    response.status(200).end()
})




module.exports = classroomsRouter