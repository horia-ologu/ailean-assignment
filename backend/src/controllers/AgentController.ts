import { Request, Response } from 'express'
import { agentService } from '../services/AgentService'
import {
	CreateAgentRequest,
	AskQuestionRequest,
	AskQuestionResponse,
} from '../models/Agent'

export class AgentController {
	// GET /agents - Get all agents
	getAllAgents = (req: Request, res: Response): void => {
		try {
			const agents = agentService.getAllAgents()
			res.json(agents)
		} catch (error) {
			console.error('Error getting agents:', error)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	// GET /agents/:id - Get a specific agent
	getAgentById = (req: Request, res: Response): void => {
		try {
			const { id } = req.params
			const agent = agentService.getAgentById(id)

			if (!agent) {
				res.status(404).json({ error: 'Agent not found' })
				return
			}

			res.json(agent)
		} catch (error) {
			console.error('Error getting agent by ID:', error)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	// POST /agents - Create a new agent
	createAgent = (req: Request, res: Response): void => {
		try {
			const { name, description }: CreateAgentRequest = req.body

			if (!name || name.trim() === '') {
				res.status(400).json({ error: 'Name is required' })
				return
			}

			const newAgent = agentService.createAgent(name.trim(), description)
			res.status(201).json(newAgent)
		} catch (error) {
			console.error('Error creating agent:', error)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	// PUT /agents/:id - Update an agent
	updateAgent = (req: Request, res: Response): void => {
		try {
			const { id } = req.params
			const { name, description }: Partial<CreateAgentRequest> = req.body

			const updatedAgent = agentService.updateAgent(id, name, description)

			if (!updatedAgent) {
				res.status(404).json({ error: 'Agent not found' })
				return
			}

			res.json(updatedAgent)
		} catch (error) {
			console.error('Error updating agent:', error)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	// DELETE /agents/:id - Delete an agent
	deleteAgent = (req: Request, res: Response): void => {
		try {
			const { id } = req.params
			const deletedAgent = agentService.deleteAgent(id)

			if (!deletedAgent) {
				res.status(404).json({ error: 'Agent not found' })
				return
			}

			res.json(deletedAgent)
		} catch (error) {
			console.error('Error deleting agent:', error)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	// POST /agents/:id/ask - Ask a question to a specific agent (Hotel Q&A Bot only)
	askQuestion = (req: Request, res: Response): void => {
		try {
			const { id } = req.params
			const { question }: AskQuestionRequest = req.body

			if (!question || question.trim() === '') {
				res.status(400).json({ error: 'Question is required' })
				return
			}

			const agent = agentService.getAgentById(id)

			if (!agent) {
				res.status(404).json({ error: 'Agent not found' })
				return
			}

			// Restrict /ask endpoint to Hotel Q&A Bot only
			if (!agentService.isHotelQABot(agent)) {
				res.status(403).json({
					error: 'Questions can only be asked to the Hotel Q&A Bot',
					availableBot: 'Hotel Q&A Bot',
				})
				return
			}

			// Process the question with keyword matching
			const answer = agentService.processHotelQuestion(question.trim())

			const response: AskQuestionResponse = {
				agentId: id,
				agentName: agent.name,
				question: question.trim(),
				answer,
				timestamp: new Date(),
			}

			res.json(response)
		} catch (error) {
			console.error('Error processing question:', error)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	// GET /health - Health check
	healthCheck = (req: Request, res: Response): void => {
		res.json({
			status: 'OK',
			timestamp: new Date(),
			service: 'Agent Management API',
		})
	}
}

export const agentController = new AgentController()
