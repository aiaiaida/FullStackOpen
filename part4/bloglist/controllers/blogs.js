const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// post new
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token in valid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId is missing or not valid' })
  }
  const blog = new Blog(body)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  return response.status(201).json(savedBlog)
})

// delete one blog
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

// update a blog
blogsRouter.put('/:id', async (request, response) => {
  const likes = request.body.likes

  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).end()
  }

  blogToUpdate.likes = likes
  const updated = await blogToUpdate.save()
  return response.json(updated)
})

module.exports = blogsRouter