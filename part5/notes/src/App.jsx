import { useState, useEffect } from 'react'
import Note from './Components/Note'
import noteService from './services/notes'
import Notification from './Components/Notification'
import loginService from './services/login'

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('new note...')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
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

  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  
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
        .catch(() => {
          setErrorMessage(`the note '${note.content}' was already deleted from server`)
          setTimeout(()=>{
            setErrorMessage(null)
          },5000)
          setNotes(notes.filter(n => n.id !== id))
        })
  }
  
  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login( {username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
            <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} />
          </label>
      </div>
      <div>
        <label>
          password
            <input type='text' value={password} onChange={({ target }) => setPassword(target.value)} />
        </label>
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={(event) => setNewNote(event.target.value)}/>
      <button type='submit'>save</button>
    </form>
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
    </div>
  )
}

export default App