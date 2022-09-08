import CountryInfo from "./CountryInfo"
const Result = ({search, allCountries}) => {
    const results = Object.values(allCountries).filter(c=>c.name.toLowerCase().includes(search))
    console.log(allCountries)
    // function handleShow (c) {
    //     return(
    //         <div>
    //             {/* <CountryInfo result={c}></CountryInfo> */}
    //         </div>
    //     )
    // }
    
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
                    {/* <button onClick={handleShow(c)}>show</button> */}
                    </div>
                ))}
            </div>
        )
    }
    else{
        return(
        <div>
            {/* <CountryInfo result={results[0]}></CountryInfo> */}
        </div>
        )
    }
 
}
export default Result