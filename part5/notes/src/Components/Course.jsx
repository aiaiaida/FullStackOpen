import Header from "./Header"
import Content from "./Content"

const Course = ({course}) => {
    const amount = course.parts.reduce((s,p) => s + p.exercises, 0)
    return (
        <div>
            <Header text={course.name}/>
            <Content parts={course.parts}/>
            <p>total of {amount} exercises</p>
        </div>
    )
}

export default Course