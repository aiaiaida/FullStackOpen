import { useState, useEffect } from 'react'
import Note from './Components/Note'
import axios from 'axios'
import noteService from './services/notes'
import Notification from './Components/Notification'

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('new note...')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
    const ghostNote = {
      id:10000,
      content: 'this is a ghost note',
      important: true
    }
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes.concat(ghostNote)))
    },[])
  
  const addNote = (event) => {
    event.preventDefault()
    console.log("button clicked", event.target)
    const newNoteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    noteService
      .create(newNoteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const note=notes.find(n => n.id===id)
    const changedNote = {...note,important:!note.important}
      noteService
        .update(id, changedNote)
        .then(returnedNote => {setNotes(notes.map(note => note.id===id? returnedNote : note))})
        .catch(error => {
          setErrorMessage(`the note '${note.content}' was already deleted from server`)
          setTimeout(()=>{
            setErrorMessage(null)
          },5000)
          setNotes(notes.filter(n => n.id !== id))
        })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={(event) => setNewNote(event.target.value)}/>
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App