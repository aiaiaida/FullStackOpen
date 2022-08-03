const Form = ({addPerson,newName,handleNameChange,newNum,handleNumChange}) => {
    return (
        <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>phone number: <input value={newNum} onChange={handleNumChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default Form