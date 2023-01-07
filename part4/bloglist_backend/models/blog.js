const config = require('../utils/config')
const mongoose = require('mongoose')
const mongoUrl = config.MONGODB_URI
const logger = require ('../utils/logger')

//logger.info(`Connecting to ${mongoUrl}`)
/*
mongoose.connect(mongoUrl)
    .then(result => { logger.info('Connected to MongoDB') })
    .catch((error) => { logger.error(`Error connecting to MongoDB: ${error.message}`) })
*/
    
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0}
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Blog', blogSchema)

