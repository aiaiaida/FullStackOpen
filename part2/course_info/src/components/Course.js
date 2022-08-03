import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({course}) => {
    return (
      <div>
        {course.map(c=> (
          <div key={c.id}>
            <Header name={c.name}></Header>
            {c.parts.map(p => <Content key={p.id} p={p}></Content>)}
            <Total sum={c.parts.reduce((a,b)=>a+b.exercises,0)}></Total>
          </div>
        ))}
      </div>
    )
  }

export default Course