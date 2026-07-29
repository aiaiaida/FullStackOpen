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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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
})

// delete a person
app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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
    const person = {
        "name": body.name,
        "number": body.number || "0",
        "id": generateID()
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT =  process.env.PORT
app.listen(PORT, ()=>{
    console.log('server running on 3001')
})