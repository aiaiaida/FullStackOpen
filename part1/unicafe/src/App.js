import { useState } from 'react'

const StatisticLine = ({text,value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistic = ({good,neutral,bad}) => {
  if (good+bad+neutral===0)
  {
    console.log("hi")
    return (
      <div>
        <h2>No feedback given</h2>
      </div>
    )
  }
  else{
    const percentage = ((good+neutral)/(good+neutral+bad)).toLocaleString('en',{style: 'percent'})
    return (
      <table>
        <StatisticLine text='good' value={good}></StatisticLine>
        <StatisticLine text='neutral' value={neutral}></StatisticLine>
        <StatisticLine text='bad' value={bad}></StatisticLine>
        <StatisticLine text='all' value={good+neutral+bad}></StatisticLine>
        <StatisticLine text='average' value={(good-bad)/(good+neutral+bad)}></StatisticLine>
        <StatisticLine text='positive' value={percentage}></StatisticLine>
      </table>
    )
  }
}

const Button = ({handleClick,text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood =() =>{
    setGood(good+1)
  }

  const handleNeutral =() => {
    setNeutral(neutral+1)
  }

  const handleBad = () => {
    setBad(bad+1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text="Good"></Button>
      <Button handleClick={handleNeutral} text="Neutral"></Button>
      <Button handleClick={handleBad} text="Bad"></Button>
      <h1>statistics</h1>
      <Statistic good={good} neutral={neutral} bad={bad}></Statistic>
    </div>
  )
}

export default App