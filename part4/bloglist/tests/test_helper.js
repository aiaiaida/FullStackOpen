const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'blog 1',
    author: 'a1',
    url: '..',
    likes: 20,
  },
  {
    title: 'blog 2',
    author: 'a2',
    url: '..',
    likes: 10,
  },
  {
    title: 'blog 3',
    author: 'a3',
    url: '..',
    likes: 30,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { 
  initialBlogs,
  blogsInDb
}