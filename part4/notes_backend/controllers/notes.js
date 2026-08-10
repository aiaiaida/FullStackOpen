const notesRouter = require('express').Router()
const Note = require('../models/note')

// all notes
notesRouter.get('/', async (request, response ) => {
  const notes = await Note.find({})
  response.json(notes)
})

// one note by id
notesRouter.get('/:id', async (request,response) => {
  const id = request.params.id
  const noteFound = await Note.findById(id)
  if (noteFound) {
    response.json(noteFound)
  } else {
    response.status(404).end()
  }
})

// add a new note
notesRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

// delete one note by id
notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Note.findByIdAndDelete(id)
  response.status(204).end()
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