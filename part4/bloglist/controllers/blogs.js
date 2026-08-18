const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

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
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const users = await User.find({})

  blog.user = users[0]

  const savedBlog = await blog.save()
  const user = await User.findById(users[0]._id)
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