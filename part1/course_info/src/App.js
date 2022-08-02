import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)
  const increasebyone = () => {setCounter(counter+1)}
  const decreasebyone = () => {setCounter(counter - 1)}
  const zero = () => {setCounter(0)}

  const Display = ({counter}) => <div>{counter}</div>

  const Button = ({onClick, text}) => <button onClick = {onClick}>{text}</button>

  return (
    <div>
      <Display counter={counter}></Display>
      <Button onClick={increasebyone} text='plus'></Button>
      <Button onClick={decreasebyone} text='minus'></Button>
      <Button onClick={zero} text='zero'></Button>
    </div>
    
  )
}

export default App