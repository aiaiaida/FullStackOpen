const Search = ({newSearch,handleSearch}) => {
    return(
        <div>
            search by name: <input value={newSearch} onChange={handleSearch}></input>
        </div>
    )
}

export default Search