import React from 'react'
import { Button, Card, CardContent, Stack, Typography, Link } from '@mui/material'

const Blog = ({ blog, updateBlog, removeBlog, userId }) => {
  const blogStyle = {
    paddingTop: 10,
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
      <Card sx={{ border: '1px solid', boxShadow: 2, borderColor: 'divider' }}>
        <CardContent>
          <Stack>
            <h2>{blog.title}</h2>
            <Link href={blog.url}>{blog.url}</Link>
            <Typography sx={{ color: 'grey' }} >added by {blog.author}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography sx={{ paddingTop:1 }}>likes {blog.likes}</Typography>
            {userId && (<Button onClick={handleLike} sx={{ color: 'blue', border: 1, borderColor: 'blue', width:'100px' }}>like</Button>)}
            {Boolean(userId) && userId.toString() === blogUserId?.toString() && (<Button onClick={handleRemoval} sx={{ color: 'red', border: 1, borderColor: 'red', width:'100px' }}>remove</Button>)}
          </Stack>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blog