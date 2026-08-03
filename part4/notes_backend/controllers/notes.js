const notesRouter = require('express').Router()
const Note = require('../models/note')

// all notes
notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// one note by id
notesRouter.get('/:id', (request,response, next) => {
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

// add a new note
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => {
    response.json(savedNote)
  })
    .catch(error => next(error))
})

// delete one note by id
notesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

// update a note
notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

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

module.exports = notesRouter