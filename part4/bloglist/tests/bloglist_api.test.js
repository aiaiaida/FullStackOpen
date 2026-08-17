const assert = require('node:assert')
const { describe, test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

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

test('if no likes property, default to 0', async () => {
  const blogWithouLikes = {
    title: 'a new blog should be added',
    author: 'aaaaa',
    url: 'sss.ss'
  }
  
  const response = await api
      .post('/api/blogs')
      .send(blogWithouLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(response.body.likes, 0)
})

test('400 if no title', async () => {
  const blogWithoutTile = {
    author: 'aaaaa',
    url: 'sss.ss',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutTile)
    .expect(400)
})

test('400 if no url', async () => {
    const blogWithoutUrl = {
    title: 'titleeeee',
    author: 'aaaaa',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
})

test('delete one by id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`)

  const blogsAfterDeletion = await helper.blogsInDb()
  const ids = blogsAfterDeletion.map(blog => blog.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAfterDeletion.length, blogsAtStart.length - 1)
})

test('likes of a blog is updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const likeUpdated = {
    ...blogToUpdate,
    likes: 50
  }

  const updated = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(likeUpdated)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(updated.body.likes, 50)
})

describe('When there is one user in db initially', async () => {
  beforeEach(async () => {
    await User.deleteMany()

    const passwordHash = await bcrypt.hash('SEKRET', 10)
    const user = new User({ username: 'root', passwordHash})

    await user.save()
  })

  test('Valid user is created successfully', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Aada xoxo',
      password: 'Salaisuus',
      name: 'AADA'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('Too short username fails with 400 and error message', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Aa',
      password: 'Salaisuus',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('username must be at least 3 characters long'))
    
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Too short password fails with 400 and error message', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Aadddda',
      password: 's',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password is required and at least 3 characters long'))
    
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after (async () => {
  await mongoose.connection.close()
})