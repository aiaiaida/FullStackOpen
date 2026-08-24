import { TextField, Button, Stack } from '@mui/material'
const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => {
  return (
    <div>
      <h2>Log in to see the blog list</h2>
      <form onSubmit={handleLogin}>
        <Stack spacing={2} sx={{ mt:2 }}>
          <TextField label='username' value={username} onChange={({ target }) => setUsername(target.value)} sx={{ width: 400 }}/>
          <TextField label='password' value={password} onChange={({ target }) => setPassword(target.value)} sx={{ width: 400 }}/>
          <Button type='submit' variant='contained' style={{ marginTop: 10, width: 400 }}>login</Button>
        </Stack>
      </form>
    </div>
  )
}

export default LoginForm