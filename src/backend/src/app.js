import express from 'express'
import cors from 'cors'
import interviewRoutes from './routes/interviewRoutes.js'
import historyRoutes from './routes/historyRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

// Routes API
app.use('/api/interviews', interviewRoutes)
app.use('/api/history', historyRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
