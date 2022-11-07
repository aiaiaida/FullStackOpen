import { useEffect,useState } from "react";
import axios from 'axios'
import Search from "./components/Search";
import Result from "./components/Result";

function App() {

  const [allCountries, setAllCountries] = useState('')
  const [search, setSearch] = useState('')
  
  useEffect(()=> {
    axios.get('https://restcountries.com/v2/all')
    .then((response) => {
      setAllCountries(response.data)
    })
  },[])

  const handleSearch = (event) => {
    event.preventDefault()
    setSearch(event.target.value)
  }

  return (
    <div>
      <Search handleSearch={handleSearch}></Search>
      <Result search = {search} allCountries={allCountries}></Result>
    </div>
  )
}

export default App;
