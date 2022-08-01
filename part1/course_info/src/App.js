const Header = (props) => {
  return(
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}
const Part = (props) => {
  return (
    <>
      <p>{props.name} {props.exercises}</p>
    </>
  )
}
const Content = (props) => {
  return (
    <div>
      <Part name={props.name1} exercises={props.exercise1}></Part>
      <Part name={props.name2} exercises={props.exercise2}></Part>
      <Part name={props.name3} exercises={props.exercise3}></Part>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.num1 + props.num2 + props.num3 }</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}></Header>
      <Content name1={part1} exercise1={exercises1} name2={part2} exercise2={exercises2} name3={part3} exercise3={exercises3}></Content>
      <Total num1={exercises1} num2={exercises2} num3={exercises3}></Total>
    </div>
  )
}

export default App