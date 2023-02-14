const mongoose = require('mongoose')

const classroomSchema = new mongoose.Schema({
    owners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    quizzes: [],
    roomName: String,
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

})

classroomSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Classroom = mongoose.model('Classroom', classroomSchema)

module.exports = Classroom