import { useState } from 'react'
import Search from './components/Search'
import Form from './components/Form'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNum,setNewNum] = useState('')
  const [newSearch,setNewSearch] = useState('')

  const handleSearch = (event) => {
    setNewSearch(event.target.value.toLowerCase())
  }

  const personToShow = newSearch
                       ? persons.filter(p=>p.name.toLocaleLowerCase().includes(newSearch))
                       : persons

  const handleNameChange = (event) =>{
      setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }
  
  const addPerson = (event) => {
    event.preventDefault()
    const hasName = persons.some(p=> p.name === newName)
    if (!hasName){
      const newPerson = {
        name:newName,
        number: newNum
      }
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNum('')
    }
    else{
      alert(`${newName} already exists`)
    }
  }
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Search newSearch={newSearch} handleSearch={handleSearch}></Search>
      <h2>Add a new</h2>
      <Form addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange}></Form>
      <h2>Numbers</h2>
      <Persons personToShow={personToShow}></Persons>
    </div>
  )
}

export default App
