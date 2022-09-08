const CountryInfo = ({result}) =>{
    return(
        <div>
            <h1>{result.name}</h1>
            <p>capital:{result.capital}</p>
            <p>area: {result.area}</p>
            <h2>Languages</h2>
            <ul>
                {result.languages.map(l=>{ 
                    return(
                        <li>{l}</li>
                    )})
                }
            </ul>
            <img src={result.flags.png} alt='flag'/>
        </div>
    )
}

export default CountryInfo