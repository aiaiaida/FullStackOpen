// import { AppBar, Container, Toolbar, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import NoteList from './Components/NoteList'
import noteService from './services/notes'
import NoteForm from './Components/NoteForm'
import Note from './Components/Note'
// import Footer from './Components/Footer'
import Home from './Components/Home'
import Notification from './Components/Notification'
import { useMatch, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Page, Navigation, Footer } from './styles/styledComponents'

const App = () => {

  const [notes, setNotes] = useState([])
  const [notification, setNotification] = useState(null)

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
        setNotification({ text: `Note '${returnedNote.content}' added!`, type: 'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
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

  // const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  const padding = { padding: 5 }

  return (
    <Page>
      <Navigation>
        <Link to='/' style={padding}>home</Link>
        <Link to='/notes' style={padding}>notes</Link>
        <Link to='/create' style={padding}>new note</Link>
      </Navigation>
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
      <Footer>
        Note app, Department of Computer Science, University of Helsinki 2026
      </Footer>
    </Page>


  // <Container>
  //   <AppBar position='static'>
  //     <Toolbar>
  //       <Button color='inherit' component={Link} to='/' sx={style}>home</Button>
  //       <Button color='inherit' component={Link} to='/notes' sx={style}>notes</Button>
  //       <Button color='inherit' component={Link} to='/create' sx={style}>new note</Button>
  //     </Toolbar>
  //   </AppBar>

  //   <Notification notification={notification} />

  //   <Routes>
  //     < Route path="/notes/:id" element={
  //       <Note note={note} toggleImportance={toggleImportanceOf} deleteNote={deleteNote}/> }/>
  //     <Route path="/notes" element={
  //       <NoteList notes={notes}/>
  //     }/>
  //     <Route path="/create" element={
  //       <NoteForm createNote={addNote} />
  //     }/>
  //     <Route path="/" element={<Home />} />
  //   </Routes>
  //   <Footer />
  // </Container>
  )
}

export default App