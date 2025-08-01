import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import routes from './routes'
import { agentService } from './services/AgentService'

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
app.use(
	cors({
		origin: function (origin, callback) {
			// In production: strict CORS - only allow exact frontend URL
			if (process.env.NODE_ENV === 'production') {
				// Block requests with no origin in production
				if (!origin) {
					console.warn(
						`🚫 CORS (Production): Blocked request with no origin header`
					)
					return callback(new Error('Not allowed by CORS'))
				}

				// Only allow the exact frontend URL from environment in production
				const authorizedOrigin = process.env.FRONTEND_URL

				if (!authorizedOrigin) {
					console.error(
						'❌ FRONTEND_URL not configured in production environment'
					)
					return callback(new Error('Not allowed by CORS'))
				}

				if (origin === authorizedOrigin) {
					callback(null, true)
				} else {
					console.warn(
						`🚫 CORS (Production): Blocked request from unauthorized origin: ${origin}`
					)
					callback(new Error('Not allowed by CORS'))
				}
			} else {
				// In development/other environments: open CORS for easier development
				console.log(
					`✅ CORS (Development): Allowing request from origin: ${
						origin || 'no origin'
					}`
				)
				callback(null, true)
			}
		},
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
		// Handle CORS errors specifically
		if (err.message === 'Not allowed by CORS') {
			return res.status(403).json({
				error: 'Forbidden',
				message: 'Origin not allowed by CORS policy',
				origin: req.headers.origin || 'unknown',
			})
		}

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
