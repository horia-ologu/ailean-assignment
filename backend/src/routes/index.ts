import { Router } from 'express'
import agentRoutes from './agents'
import { agentController } from '../controllers/AgentController'

const router = Router()

// Health check route
router.get('/health', agentController.healthCheck)

// Agent routes
router.use('/agents', agentRoutes)

export default router
