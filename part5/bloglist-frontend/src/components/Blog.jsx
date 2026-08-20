import { useState } from "react"

const Blog = ({ blog }) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {!detailVisible && (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setDetailVisible(!detailVisible)}>view</button> 
        </div>
      )}
      {detailVisible && (
        <div>
          <div>
            {blog.title}
            <button onClick={() => setDetailVisible(!detailVisible)}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}</div>
          <div>{blog.author}</div>
        </div>
      )}
    </div>
  )
}

export default Blog