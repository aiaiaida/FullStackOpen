import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import Note from './Note'
import noteService from '../services/notes'
import loginService from '../services/login'
import LoginForm from './LoginForm'
import NoteForm from './NoteForm'
import Togglable from './Togglable'

const NoteList = ({ notes }) => {

  const [showAll, setShowAll] = useState(true)
  const [user, setUser] = useState(null)

  // const noteFormRef = useRef()
  // useEffect(() => {
  //   const ghostNote = {
  //     id:10000,
  //     content: 'this is a ghost note',
  //     important: true
  //   }
  //   noteService
  //     .getAll()
  //     .then(initialNotes => setNotes(initialNotes.concat(ghostNote)))},[])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
    } catch {
      // setErrorMessage('wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
    }
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)


  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm handleSubmit={handleLogin} />
    </Togglable>
  )

  return (
    <div>
      {!user && loginForm()}
      <h2>Notes</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>content</TableCell>
              <TableCell>user</TableCell>
              <TableCell>important</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notesToShow.map(note => (
              <TableRow key={note.id}>
                <TableCell>
                  <Link to={`/notes/${note.id}`}>{note.content}</Link>
                </TableCell>
                <TableCell>{note.user?.name ?? 'unknown user'}</TableCell>
                <TableCell>{note.important ? 'yes' : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div> */}
    </div>
  )
}

export default NoteList