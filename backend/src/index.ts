import dotenv from 'dotenv'
import express from 'express'
import routes from './routes'
import { agentService } from './services/AgentService'
import {
	corsMiddleware,
	requestLogger,
	errorHandler,
	notFoundHandler,
} from './middleware'

// Only load .env.local in development
if (process.env.NODE_ENV !== 'production') {
	dotenv.config({ path: '.env.local' })
	console.log('📁 Loaded local environment variables')
	console.log('🌍 Frontend URL:', process.env.FRONTEND_URL || 'Not set')
}
console.log('🌍 Frontend URL:', process.env.FRONTEND_URL || 'Not set')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(corsMiddleware)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// API routes
app.use('/api', routes)

// Root endpoint
app.get('/', (req, res) => {
	res.json({
		message: 'Agent Management API',
		version: '1.0.0',
		endpoints: {
			health: '/api/health',
			agents: '/api/agents',
			documentation: 'See README.md for full API documentation',
		},
	})
})

// 404 handler
app.use('*', notFoundHandler)

// Error handling middleware
app.use(errorHandler)

// Initialize Hotel Q&A Bot on startup
const initializeApp = async () => {
	try {
		const hotelBot = agentService.initializeHotelBot()
		console.log(`✅ Hotel Q&A Bot initialized with ID: ${hotelBot.id}`)

		app.listen(PORT, () => {
			const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`

			console.log(`🚀 Server is running on port ${PORT}`)
			console.log(`📡 Health check: ${serverUrl}/api/health`)
			console.log(`🤖 Agents API: ${serverUrl}/api/agents`)
			console.log(`🏨 Hotel Q&A Bot ready for questions!`)
			console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
		})
	} catch (error) {
		console.error('Failed to initialize application:', error)
		process.exit(1)
	}
}

// Graceful shutdown
process.on('SIGINT', () => {
	console.log('\n� Shutting down gracefully...')
	process.exit(0)
})

process.on('SIGTERM', () => {
	console.log('\n🛑 Shutting down gracefully...')
	process.exit(0)
})

// Start the server
initializeApp()
