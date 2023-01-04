require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')
const { request } = require('express')
const url = process.env.MONGODB_URI


app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
//app.use(express.static('build'))


app.get('/info', (request, response) => {
    const date = new Date()
    Person.countDocuments()
    .then(numberOfEntries => {
        response.send(`Phonebook has info for ${numberOfEntries} people.
        <br>
        ${date}`)  
    })
    .catch(error => {
        console.error(error);
        response.send(error);
      });

    
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
      })
})


app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    console.log(`Id: ${id}`);
    Person.findById(id).exec()
    .then((person) => {
        response.json(person)
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => {
        console.log(error)
        response.status(500).end()
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'content missing' })
      }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => {
        console.log(error)
        response.status(500).end()
    })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message})
    }
  
    next(error)
  }

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})