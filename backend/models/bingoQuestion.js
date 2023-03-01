const mongoose = require('mongoose')

const bingoQuestionSchema = new mongoose.Schema({
    creator:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    parentQuiz: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        }
    ],
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    hints: [
        {
            type: String
        }
    ]
})

bingoQuestionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const BingoQuestion = mongoose.model('BingoQuestion', bingoQuestionSchema)

module.exports = BingoQuestion