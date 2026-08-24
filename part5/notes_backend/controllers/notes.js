const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// all notes
notesRouter.get('/', async (request, response ) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })
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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// add a new note
notesRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId is missing or not valid' })
  }

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  const populatedNote = await savedNote.populate('user', { username: 1, name:1 })

  response.status(201).json(populatedNote)
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