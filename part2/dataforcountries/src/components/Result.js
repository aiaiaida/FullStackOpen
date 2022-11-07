import CountryInfo from "./CountryInfo"
const Result = ({search, allCountries}) => {
    const results = Object.values(allCountries).filter(c=>c.name.toLowerCase().includes(search))
    console.log('type',typeof(results))
    
    if (results.length > 10){
        return (
            <div>
                <p>Too many matches, please specify</p>
            </div>
         )
    }
    else if (results.length > 1){
        return (
            <div>
                {results.map(c=> (
                    <div>
                    <p>{c.name}</p>
                    </div>
                ))}
            </div>
        )
    }
    else{
        return(
        <div>
            <CountryInfo results={results}></CountryInfo>
        </div>
        )
    }
 
}
export default Result