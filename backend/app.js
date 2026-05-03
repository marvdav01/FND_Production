import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import eventsRoutes from './routes/events.js'
import equipmentRoutes from './routes/equipment.js'
import crewRoutes from './routes/crew.js'
import paymentsRoutes from './routes/payments.js'
import reportsRoutes from './routes/reports.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/api/auth', authRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/crew', crewRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/reports', reportsRoutes)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'FND Production Backend is running' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ success: false, error: err.message || 'Server error' })
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
