require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

// connect to DB
mongoose.set('strictQuery', false)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB', error.message)
  })
// schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})
// json format on returned info
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
// model
const Blog = mongoose.model('Blog', blogSchema)

app.use(express.json())
app.use(express.static('dist'))

// get all
app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

// get one blog with id
app.get('/api/blogs/:id', (request, response) => {
  Blog.findById(request.params.id).then((blog) => {
    response.json(blog)
  })
})

// post new
app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})