import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      setPassword('')
      setUsername('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage('')
      },5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to see the blog list</h2>
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
      <Notification message={errorMessage}/>
      <div>
        <p>{user.name} logged in</p>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
      </div>
    </div>
  )
}

export default App