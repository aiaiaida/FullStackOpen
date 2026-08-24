import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { Button, TextField } from '@mui/material'
import { Button, Input } from '../styles/styledComponents'

const NoteForm = ({ createNote }) => {

  const [newNote, setNewNote] = useState('')
  const navigate = useNavigate()

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })
    navigate('/notes')

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <Input value={newNote} onChange={event => setNewNote(event.target.value)} placeholder="write the new note here"/>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>save</Button>
      </form>
    </div>
  )
}

export default NoteForm