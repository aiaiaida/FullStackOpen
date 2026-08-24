import { Alert } from '@mui/material'
const Notification = ({ message }) => {
  if (!message) {
    return null
  }
  return (
    <Alert className={message.type}>
      {message.text}
    </Alert>
  )
}

export default Notification