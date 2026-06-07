const express = require('express')
const app = express()

app.use(express.json())

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
    response.json(persons)
})

// get a single person
app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (!person){
        console.log("not found")
        response.status(404).end()
    } else {
        response.json(person)
    }
})

// delete a person
app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// generate id
const generateID = () => {
    const maxID = persons.length > 0 ? Math.max(...persons.map(p => Number(p.id))) : 0
    return String(maxID+1)
}

// add a new person
app.post("/api/persons/", (request, response) => {
    body = request.body
    const nameExists = persons.some(p => p.name === body.name)
    if (!body.name || !body.number || nameExists ) {
        console.log("no name or no number, or name exists")
        return response.status(400).json({
            error: "missing name, or missing number, or name exists"
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

const PORT = 3001
app.listen(PORT, ()=>{
    console.log('server running on 3001')
})