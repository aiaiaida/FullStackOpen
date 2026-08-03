const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// get all
blogsRouter.get('/', (request, response, next) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
  .catch(error => next(error))
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
blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
  .catch(error => next(error))
})

module.exports = blogsRouter