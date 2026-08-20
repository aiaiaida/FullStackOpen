const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else if (blogs.length === 1) {
    return blogs[0]
  } else {
    return blogs.reduce((fav, blog) => {
      return fav.likes >= blog.likes ? fav : blog}, blogs[0])}
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else if (blogs.length === 1) {
    return { author: blogs[0].author, 
              blogs: 1 }
  } else {
    const authorCounts = _.countBy(blogs, 'author')
    const pairs = _.toPairs(authorCounts)
    const ordered = _.sortBy(pairs, [1])

    return {
      author: ordered[ordered.length-1][0],
      blogs: ordered[ordered.length-1][1]
    }
  }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
    return null
  } else if (blogs.length === 1) {
    return { author: blogs[0].author, 
              likes: blogs[0].likes }
  } else {
    const authorGroups = _.groupBy(blogs, 'author')
    const authorLikes = Object.entries(authorGroups).map(([author, blogs]) => {
      return {
        author,
        likes: _.sumBy(blogs, 'likes')
      }
    })

    return _.maxBy(authorLikes, 'likes')
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes   }