const mongoose = require('mongoose')

// connect to DB
mongoose.set('strictQuery', false)

// schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
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
module.exports = mongoose.model('Blog', blogSchema)