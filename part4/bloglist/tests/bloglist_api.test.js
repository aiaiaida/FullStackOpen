const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async() => {
  await Blog.deleteMany()

  const blogObjs = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjs.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned in correct amount', async () => {
  const blogsReturned = await api.get('/api/blogs')
  assert.strictEqual(blogsReturned.body.length, helper.initialBlogs.length)
})

test('id is the unique identifier, not _id', async () => {
  const blogs = await helper.blogsInDb()

  assert(blogs[0].id)
  assert.strictEqual(blogs[0]._id, undefined)
})

test('POSTing a new blog works', async () => {
  const newBlog = {
    title: 'a new blog should be added',
    author: 'aaaaa',
    url: 'sss.ss',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes('a new blog should be added'))
})

after (async () => {
  await mongoose.connection.close()
})