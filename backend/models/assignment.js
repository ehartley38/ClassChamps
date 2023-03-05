const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
    assignmentName: {type: String},
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    },
    dueDate:{
        type: Date
    }
})

assignmentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment