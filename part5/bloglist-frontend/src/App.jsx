import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

  const addBlog = (event) => {
    event.preventDefault()
    const newBlogObject = {
      title,
      author,
      url
    }

    blogService.create(newBlogObject).then(returned => {
      setBlogs(blogs.concat(returned))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage({text: `a new blog ${returned.title} by ${returned.author} has been added`, type: 'info'})
      setTimeout(() => {
        setMessage(null)
      },5000)
    })
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label> title:
          <input value={title} onChange={(event) => setTitle(event.target.value)}/>
        </label>
      </div>
      <div>
        <label> author:
          <input value={author} onChange={(event) => setAuthor(event.target.value)}/>
        </label>
      </div>
      <div>
        <label> url:
          <input value={url} onChange={(event) => setUrl(event.target.value)}/>
        </label>
      </div>
      <button type='submit'>create</button>
    </form>
  )

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