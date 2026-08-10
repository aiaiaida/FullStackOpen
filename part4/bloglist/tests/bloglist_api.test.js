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

after (async () => {
  await mongoose.connection.close()
})