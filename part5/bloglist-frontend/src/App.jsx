import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setPassword('')
      setUsername('')
    } catch {
      setMessage({text:'wrong credentials', type: 'error'})
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken('')
    setUser(null)
  }

  const addBlog = ( newBlogObject ) => {

    blogService.create(newBlogObject).then(returned => {
      setBlogs(blogs.concat(returned))
      setMessage({text: `a new blog ${returned.title} by ${returned.author} has been added`, type: 'info'})
      setTimeout(() => {
        setMessage(null)
      },5000)
    })
  }

  const blogForm = () => {
    const hideWhenVisible = {display: blogFormVisible ? 'none' : ''}
    const showWhenVisible = {display: blogFormVisible ? '' : 'none'}

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={()=> {setBlogFormVisible(true)}}>create a new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm addBlog={addBlog} />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  } 

  if (user === null) {
    return (
      <div>
        <h2>Log in to see the blog list</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
                <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} />
              </label>
          </div>
          <div>
            <label>
              password
                <input type='text' value={password} onChange={({ target }) => setPassword(target.value)} />
            </label>
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
  )}

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>
      <div>
        <div>
          <span>{user.name} logged in</span>
          <button onClick={handleLogOut}>Log out</button>
        </div>
        {blogForm()}
        {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
      </div>
    </div>
  )
}

export default App