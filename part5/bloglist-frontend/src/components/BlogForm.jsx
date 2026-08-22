import React from 'react'
import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogPrep = (event) => {
    event.preventDefault()
    const newBlogObject = {
      title,
      author,
      url
    }
    addBlog(newBlogObject)
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <form onSubmit={blogPrep}>
      <div>
        <label> title:
          <input value={title} onChange={({ target }) => setTitle(target.value)}/>
        </label>
      </div>
      <div>
        <label> author:
          <input value={author} onChange={({ target }) => setAuthor(target.value)}/>
        </label>
      </div>
      <div>
        <label> url:
          <input value={url} onChange={({ target }) => setUrl(target.value)}/>
        </label>
      </div>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm