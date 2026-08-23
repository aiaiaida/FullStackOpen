import { useState, useEffect } from 'react'
import NoteList from './Components/NoteList'
import noteService from './services/notes'
import NoteForm from './Components/NoteForm'
import Note from './Components/Note'
import Footer from './Components/Footer'
import Home from './Components/Home'
import { useMatch, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {

  const [notes, setNotes] = useState([])
  const match = useMatch('/notes/:id')
  const note = match ? notes.find(n => n.id === match.params.id) : null

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))},[])


  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id===id)
    const changedNote = { ...note,important:!note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id===id? returnedNote : note))
      })
      .catch(() => {
        // setErrorMessage(`the note '${note.content}' was already deleted from server`)
        // setTimeout(() => {
        //   setErrorMessage(null)
        // },5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to='/'>home</Link>
        <Link style={padding} to='/notes'>notes</Link>
        <Link style={padding} to='/create'>new note</Link>
      </div>

      <Routes>
        < Route path="/notes/:id" element={
          <Note note={note} toggleImportance={toggleImportanceOf} deleteNote={deleteNote}/> }/>
        <Route path="/notes" element={
          <NoteList notes={notes}/>
        }/>
        <Route path="/create" element={
          <NoteForm createNote={addNote} />
        }/>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App