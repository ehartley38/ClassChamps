const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
    creator:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    quizName: {type: String},
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BingoQuestion',
        }
    ],
    quizType: {
        type: String,
        enum: {
            values: ['Bingo', 'MultiChoice'],
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
