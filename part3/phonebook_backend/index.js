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
    const amount = persons.length
    const time = new Date()
    response.send(`<div>
        <p>Phonebook has info for ${amount} people</p>
        <p>${time}</p>
    </div>`)
})

// get all persons
app.get("/api/persons/", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// get a single person
app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    Person.findById(id).then(returnedPerson => {
        response.json(returnedPerson)
    })
    .catch(error => {
        console.log(error)
        response.status(500).end()
    })
})

// delete a person
app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(res => {
        response.status(204).end()
    })
})

// add a new person
app.post("/api/persons/", (request, response) => {
    const body = request.body
    const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
    if (!body.name) {
        return response.status(400).json({
            error: "missing name"
        })
    } else if (!body.number) {
         return response.status(400).json({
            error: "missing number"
        })
    } else if (nameExists) {
         return response.status(400).json({
            error: "name exists"
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT =  process.env.PORT
app.listen(PORT, ()=>{
    console.log('server running on 3001')
})