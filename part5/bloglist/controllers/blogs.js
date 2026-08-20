const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

// get all
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  response.json(blogs)
})

// get one blog with id
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id).then((blog) => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// post new
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  return response.status(201).json(savedBlog)
})

// delete one blog
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogId = request.params.id
  const user = request.user
  const blog = await Blog.findById(blogId)
  if (!blog) {
  return response.status(404).json({ error: 'blog not found' })
}

  if (blog.user && blog.user.toString() === user._id.toString()){
    await Blog.findByIdAndDelete(blogId)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'only the creator can delete this blog' })
  }
})

// update a blog
blogsRouter.put('/:id', async (request, response) => {
  const { likes, user } = request.body

  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).end()
  }

  blogToUpdate.likes = likes
  if (user) {
    blogToUpdate.user = user
  }
  const updated = await blogToUpdate.save()
  return response.json(updated)
})

module.exports = blogsRouter