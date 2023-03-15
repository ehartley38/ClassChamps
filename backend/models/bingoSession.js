const mongoose = require('mongoose')

const bingoSessionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    questions: [
        {
            question: String,
            answer: String,
            hint: String,
            isCorrect: Boolean
        }
    ],
    startTime: Date,
})

bingoSessionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const BingoSession = mongoose.model('BingoSession', bingoSessionSchema)

module.exports = BingoSession