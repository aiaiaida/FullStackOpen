const app = require('./app')
const { MONGODB_URI, PORT } = require('./utils/config')
const logger = require('./utils/logger')

app.listen(PORT, () => {
  logger.info(`server is running on port ${PORT}`)
})