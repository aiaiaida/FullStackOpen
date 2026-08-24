import Blog from './Blog'
import { Link } from 'react-router-dom'
const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)

  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {sortedBlogs.map(blog => (
          <li>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList