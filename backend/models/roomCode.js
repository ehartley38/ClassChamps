const mongoose = require('mongoose')

const roomCodeSchema = new mongoose.Schema({
    code: {
        type: String
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    }
})

roomCodeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const RoomCode = mongoose.model('RoomCode', roomCodeSchema)

module.exports = RoomCode