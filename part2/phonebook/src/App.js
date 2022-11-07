import { useEffect, useState } from 'react'
import Search from './components/Search'
import Form from './components/Form'
import Persons from './components/Persons'
import axiosService from './services/people'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum,setNewNum] = useState('')
  const [newSearch,setNewSearch] = useState('')

  useEffect(()=> {
    axiosService.getAll()
    .then(initPersons => {
      setPersons(initPersons)
    })
  },[])

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
      axiosService.postNew(newPerson)
      .then (newData => {
        setPersons(persons.concat(newData))
        setNewName('')
        setNewNum('')
      })
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
