require('dotenv').config()
const express = require('express')
const note = require('./models/note')
const app = express()
const Note = require(('./models/note'))

app.use(express.json())
app.use(express.static('dist'))

let notes = []

// info
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// all notes
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

// one note by id
app.get('/api/notes/:id', (request,response, next) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {next(error)})
})

// delete one note by id
app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id).then(res => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

// update a note
app.put('api/note/:id', (request, response, next) => {
    const {content, important} = request.body

    Note.findById(request.params.id).then(returnedNote => {
        if (!returnedNote) {
            return response.status(404).end()
        }

        returnedNote.content = content
        returnedNote.important = important

        return returnedNote.save().then(updated => {
            response.json(updated)
        })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})