import { useState, useEffect, useRef } from 'react'
import Note from './Components/Note'
import noteService from './services/notes'
import Notification from './Components/Notification'
import loginService from './services/login'
import LoginForm from './Components/LoginForm'
import NoteForm from './Components/NoteForm'
import Togglable from './Components/Togglable'
import Footer from './Components/Footer'

const App = () => {

  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const ghostNote = {
      id:10000,
      content: 'this is a ghost note',
      important: true
    }
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes.concat(ghostNote)))},[])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const note=notes.find(n => n.id===id)
    const changedNote = { ...note,important:!note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {setNotes(notes.map(note => note.id===id? returnedNote : note))})
      .catch(() => {
        setErrorMessage(`the note '${note.content}' was already deleted from server`)
        setTimeout(() => {
          setErrorMessage(null)
        },5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm handleSubmit={handleLogin} />
    </Togglable>
  )

  const noteFormRef = useRef()

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote}/>
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <Footer />
    </div>
  )
}

export default App