const app = require('./app')
const { PORT } = require('./config/env.config')

app.listen(PORT, () => {
  console.log(`✅ BKParking Backend running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health`)
})