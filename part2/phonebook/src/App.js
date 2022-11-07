import { useEffect, useState } from 'react'
import Search from './components/Search'
import Form from './components/Form'
import Persons from './components/Persons'
import axiosService from './services/people'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum,setNewNum] = useState('')
  const [newSearch,setNewSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

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
        setErrorMessage(`${newName} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.concat(newData))
        setNewName('')
        setNewNum('')
      })
    }
    else{
      const personExist = persons.find(p=> p.name === newName)
      let answer = window.confirm(`${newName} already exists, replace the old number with the new one?`)
      if (answer) {
        const newOne= {
          name:newName,
          number: newNum
        }
        axiosService.updatePerson(personExist.id,newOne)
        .then(returned => {
          setErrorMessage(`${newName}'s number is changed`)
          setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
          setPersons(persons.map(p => p.id !== personExist.id ? p : returned))
          setNewName('')
          setNewNum('')
        })
      }
    }
  }
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <Search newSearch={newSearch} handleSearch={handleSearch} />
      <h2>Add a new</h2>
      <Form addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange}></Form>
      <h2>Numbers</h2>
      <Persons personToShow={personToShow} />
    </div>
  )
}

export default App
