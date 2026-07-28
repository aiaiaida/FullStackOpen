import axiosService from '../services/people'
const Person = ({p}) => {

    const handleDeletion = (id,name) => {
        let answer = window.confirm(`Delete ${name}?`)
        if (answer) {
          axiosService.deletePerson(id)
          window.location.reload(false)
        }
      }
    return (
        <div style={{display:'flex',alignItems:'center'}}>
            <p>{p.name} {p.number}</p>
            <div style={{marginLeft:'1em'}}>
                <button onClick={() => handleDeletion(p.id,p.name)}>delete</button>
            </div>
        </div>
    )
}

export default Person