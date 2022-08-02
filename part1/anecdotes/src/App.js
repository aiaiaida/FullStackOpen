import { useState } from 'react'
const Most = (props) => {
  const max = Math.max(...props.vote)
  const index = props.vote.indexOf(max)
  if(max === 0 & index === 0){
    return(
      <div>
        <p>You haven't voted yet</p>
      </div>
    )
  }
  else{
    return (
      <div>
        <h1>Anecdote with most votes</h1>
        <div>{props.anecdotes[index]}</div>
      </div>
    )
  }
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]

  const [vote,setVote] = useState(Array(7).fill(0))
  const [selected, setSelected] = useState(0)

  const handleClick = () => {
    const copy=[...vote]
    copy[selected] += 1
    setVote(copy)
  }

  const randomNum = ()=>{
    console.log("clicked and selected is", {selected})
    while (true){
      let newNum = Math.floor(Math.random() * 6)
      if (newNum!==selected){
        setSelected(newNum)
        break
      }
      else{
        continue
      }
    }
  }

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>has {vote[selected]} votes</p>
      <button onClick={handleClick}>vote</button>
      <button onClick={randomNum}>next anecdote</button>
      <Most vote={vote} anecdotes={anecdotes}></Most>
    </div>
  )
}

export default App;
