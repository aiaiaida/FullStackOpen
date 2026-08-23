import React from 'react'
import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, userId }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user?.id || blog.user }
    await updateBlog(updatedBlog)
  }

  const handleRemoval = async () => {
    await removeBlog(blog)
  }

  const blogUserId = blog.user?.id || blog.user
  return (
    <div data-testid="blog" style={blogStyle}>
      <div>
        <h2>{blog.title}</h2>
        <div>{blog.url}</div>
        <div>likes {blog.likes}
          <button onClick={handleLike}>like</button>
        </div>
        <div>added by {blog.author}</div>
        {userId === blogUserId && (
          <button onClick={handleRemoval}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog