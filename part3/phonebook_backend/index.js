require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Person = require('./models/person')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')))

let persons = []

app.get("/info", (request, response) => {
    Person.countDocuments({}).then(count => {
        response.send(`<div>
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
    </div>`)
    })
    .catch(error => next(error))
})

// get all persons
app.get("/api/persons/", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// get a single person
app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(returnedPerson => {
        response.json(returnedPerson)
    })
    .catch(error => {next(error)})
})

// delete a person
app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(res => {
        response.status(204).end()
    })
    .catch(error => {next(error)})
})

// add a new person
app.post("/api/persons/", (request, response, next) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: "missing name"
        })
    } else if (!body.number) {
         return response.status(400).json({
            error: "missing number"
        })
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

// update an existing
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const {name, number} = body
    Person.findById(request.params.id).then(person => {
        if (!person) {
            return response.status(404).end()
        }
        person.name = name
        person.number = number
        return person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    })
    .catch(error => next(error))
})

// error handler
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError'){
        return response.status(400).send({error:'malformatted ID'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}

// unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT =  process.env.PORT
app.listen(PORT, ()=>{
    console.log('server running on 3001')
})