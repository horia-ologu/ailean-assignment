import cors from 'cors'

export const corsMiddleware = cors({
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
