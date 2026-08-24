import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

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
      navigate('/')
    } catch {
      setMessage({ text:'wrong credentials', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken('')
    setUser(null)
    navigate('/')
  }

  const addBlog = ( newBlogObject ) => {
    blogService.create(newBlogObject).then(returned => {
      setBlogs(blogs.concat(returned))
      setMessage({ text: `a new blog ${returned.title} by ${returned.author} has been added`, type: 'info' })
      navigate('/')
      setTimeout(() => {
        setMessage(null)
      },5000)
    })
  }


  const updateBlog = async (updatedBlog) => {
    const returnedBlog = await blogService.updateBlog(updatedBlog.id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) ){
      await blogService.removeBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      navigate('/')
    }
  }

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch ? blogs.find(blog => blog.id === blogMatch.params.id) : null
  const padding = {
    padding: 5
  }
  return (
    <div>
      <div>
        <Link style={padding} to='/'>blogs</Link>
        {user && <Link style={padding} to='/create'>new blog</Link>}
        {!user && <Link style={padding} to='/login'>login</Link>}
        {user && <button onClick={handleLogOut}>Log out</button>}
        <Notification message={message}/>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs}/>} />
          <Route path="/login" element={<LoginForm username={username} password={password} setUsername={setUsername} setPassword={setPassword} handleLogin={handleLogin}/>} />
          <Route path="blogs/:id" element={blog ? <Blog blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} userId={user?.id} /> : (<div>Loading ...</div>)}/>
          <Route path="create" element={<BlogForm addBlog={addBlog}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App