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

module.exports = { dummy, totalLikes, favoriteBlog}