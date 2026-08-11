const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// get all
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
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
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()

  return response.status(201).json(savedBlog)
})

// delete one blog
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

module.exports = blogsRouter