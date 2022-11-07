const CountryInfo = ({results}) =>{
    return(
        
        <div>
            <h1>{results[0].name}</h1>
            <p>capital:{results[0].capital}</p>
            <p>area: {results[0].area}</p>
            <h2>Languages</h2>
            <ul>
                {results[0].languages.map(l=>{
                    <li>{l}</li>
                })}
            </ul>
            <img src={results[0].flags.png} alt='flag'/>
        </div>
    )
}

export default CountryInfo