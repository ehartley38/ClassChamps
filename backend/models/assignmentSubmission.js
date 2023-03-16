const mongoose = require('mongoose')

const assignmentSubmissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    submissionDate: Date,
    timeToComplete: Date
})

assignmentSubmissionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema)

module.exports = AssignmentSubmission