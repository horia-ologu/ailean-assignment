import express from 'express'
import cors from 'cors'
import routes from './routes'
import { agentService } from './services/AgentService'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? ['https://vercel.app', 'https://*.vercel.app']
				: true, // Allow all origins in development
		credentials: true,
	})
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
	next()
})

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
app.use('*', (req, res) => {
	res.status(404).json({
		error: 'Endpoint not found',
		path: req.originalUrl,
		availableEndpoints: ['/api/health', '/api/agents'],
	})
})

// Error handling middleware
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error('Unhandled error:', err)
		res.status(500).json({
			error: 'Internal server error',
			message:
				process.env.NODE_ENV === 'development'
					? err.message
					: 'Something went wrong',
		})
	}
)

// Initialize Hotel Q&A Bot on startup
const initializeApp = async () => {
	try {
		const hotelBot = agentService.initializeHotelBot()
		console.log(`✅ Hotel Q&A Bot initialized with ID: ${hotelBot.id}`)

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`)
			console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
			console.log(`🤖 Agents API: http://localhost:${PORT}/api/agents`)
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
