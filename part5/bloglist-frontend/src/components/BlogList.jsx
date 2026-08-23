import Blog from './Blog'
const BlogList = ({ blogs, user, updateBlog, removeBlog }) => {
  const sortedBlogs = [...blogs].sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)

  return (
    <div>
      <h2>blogs</h2>

      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          userId={user?.id}
        />
      ))}
    </div>
  )
}

export default BlogList