const mongoose = require('mongoose')
//const uniqueValidator = require('mongoose-unique-validator')

const classroomSchema = new mongoose.Schema({
    owners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    quizzes: [],
    roomName: {
        type: String,
        required: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    roomCode: {
        type: String,
        
    }

})


// Check if roomcode is already taken
classroomSchema.pre('findOneAndUpdate', async function () {
    console.log('inside pre middleware');
    if (this.getUpdate().roomCode) {
        const doc = await this.model.findOne({ roomCode: this.getUpdate().roomCode})
        if (doc && doc._id !== this._id) {
            throw new Error('room code must be unique')
        }
    }
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