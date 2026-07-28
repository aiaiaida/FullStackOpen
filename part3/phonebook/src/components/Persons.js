import Person from './Person'
const Persons = ({personToShow}) => {
    return(
        <div>
            {personToShow.map(p => (
            <div key={p.id}>
              <Person p={p}></Person>
            </div>
          ))}
        </div>
    )
}

export default Persons