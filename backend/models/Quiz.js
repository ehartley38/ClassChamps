const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
    creator:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BingoQuestion'
        }
    ],
    optional: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date
    },
    dueDate: {
        type: Date
    },
    quizType: {
        type: String,
        enum: {
            values: ['bingo', 'multiChoice'],
        }
    }
})

QuizSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Quiz = mongoose.model('Quiz', QuizSchema)

module.exports = Quiz
