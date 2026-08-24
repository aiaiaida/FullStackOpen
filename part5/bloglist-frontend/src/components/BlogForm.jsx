import React from 'react'
import { useState } from 'react'
import { Stack, TextField, Button } from '@mui/material'

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
    <div>
      <h2>Create new</h2>
      <form onSubmit={blogPrep}>
        <Stack spacing={2} sx={{ mt:2 }}>
          <TextField label='title' value={title} onChange={({ target }) => setTitle(target.value)} sx={{ width: 400 }}/>
          <TextField label='author' value={author} onChange={({ target }) => setAuthor(target.value)} sx={{ width: 400 }}/>
          <TextField label='url' value={url} onChange={({ target }) => setUrl(target.value)} sx={{ width: 400 }}/>
          <Button type='submit' variant='contained' style={{ marginTop: 10, width:400 }}>create</Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm