require('dotenv').config()
const express = require('express')
const note = require('./models/note')
const app = express()
const Note = require(('./models/note'))

app.use(express.json())
app.use(express.static('dist'))

let notes = []

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request,response) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        response.json(note)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const generateID = () => {
    const maxID = notes.length > 0 ? Math.max(...notes.map(note => Number(note.id))):0
    return String(maxID+1)
}

app.post('/api/notes/', (request,response) => {
    const body = request.body
    
    if (!body.content) {
        return response.status(400).json({
            error: "content missing"
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})