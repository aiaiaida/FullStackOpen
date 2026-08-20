import { useState } from "react"

const Blog = ({ blog, updateBlog }) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user?.id || blog.user}
    await updateBlog(updatedBlog)
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
          <div>likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.author}</div>
        </div>
      )}
    </div>
  )
}

export default Blog