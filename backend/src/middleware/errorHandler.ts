import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
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

export const notFoundHandler = (req: Request, res: Response) => {
	res.status(404).json({
		error: 'Endpoint not found',
		path: req.originalUrl,
		availableEndpoints: ['/api/health', '/api/agents'],
	})
}
