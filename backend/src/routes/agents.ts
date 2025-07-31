import { Router } from 'express'
import { agentController } from '../controllers/AgentController'

const router = Router()

// Agent CRUD routes
router.get('/', agentController.getAllAgents)
router.get('/:id', agentController.getAgentById)
router.post('/', agentController.createAgent)
router.put('/:id', agentController.updateAgent)
router.delete('/:id', agentController.deleteAgent)

// Hotel Q&A Bot interaction route
router.post('/:id/ask', agentController.askQuestion)

export default router
