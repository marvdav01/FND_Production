import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import eventsRoutes from './routes/events.js'
import equipmentRoutes from './routes/equipment.js'
import crewRoutes from './routes/crew.js'
import paymentsRoutes from './routes/payments.js'
import reportsRoutes from './routes/reports.js'
import uploadsRoutes from './routes/uploads.js'

import os from 'os';

dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

// Security & Utility Middlewares
app.set('trust proxy', 1)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(morgan('dev'))
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '8mb' }))
app.use(express.urlencoded({ extended: true, limit: '8mb' }))

// Rate Limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { success: false, error: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti.' }
})
app.use('/api/', limiter)

// Static Files
app.use('/uploads', express.static('uploads', {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
  setHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff')
  },
}))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/crew', crewRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/uploads', uploadsRoutes)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'FND Production Backend is running' })
})

app.use((err, req, res, next) => {
  console.error(err)
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, error: err.message })
  }
  if (err.message?.includes('Format file tidak didukung')) {
    return res.status(400).json({ success: false, error: err.message })
  }
  res.status(500).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message || 'Server error' })
})

// Mendapatkan IP Jaringan Lokal (Network IP)
const getNetworkIP = () => {
  const interfaces = os.networkInterfaces();
  
  // Prioritaskan adapter Wi-Fi jika ada
  if (interfaces['Wi-Fi']) {
    const wifiIface = interfaces['Wi-Fi'].find(iface => iface.family === 'IPv4' && !iface.internal);
    if (wifiIface) return wifiIface.address;
  }

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

app.listen(port, '0.0.0.0', () => {
  const networkIP = getNetworkIP();
  console.log(`Backend running on:`)
  console.log(`- Local: http://localhost:${port}`)
  console.log(`- Network: http://${networkIP}:${port}`)
})
