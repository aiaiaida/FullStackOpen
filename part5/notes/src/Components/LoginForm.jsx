import { useState } from "react"

const LoginForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = event => {
    event.preventDefault()
    handleSubmit({ username, password })
  }
  
  return (
    <form onSubmit={submit}>
      <div>
        <label>
          username
            <input type='text' value={username} onChange={({ target })=>setUsername(target.value)} />
          </label>
      </div>
      <div>
        <label>
          password
            <input type='text' value={password} onChange={({ target })=>setPassword(target.value)} />
        </label>
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm