import { Agent } from '../models/Agent'
import * as fs from 'fs'
import * as path from 'path'

interface AgentDB {
	agents: Agent[]
	metadata: {
		nextId: number
		lastUpdated: string
		[key: string]: any
	}
}

class AgentService {
	private dbPath = path.join(__dirname, '../../lib/agents-db.json')
	private db: AgentDB
	private readonly HOTEL_QA_BOT_NAME = 'Hotel Q&A Bot'

	constructor() {
		this.db = this.loadDatabase()
	}

	private loadDatabase(): AgentDB {
		try {
			if (fs.existsSync(this.dbPath)) {
				const data = fs.readFileSync(this.dbPath, 'utf8')
				return JSON.parse(data)
			}
		} catch (error) {
			console.error('Error loading database:', error)
		}

		// Return default database structure if file doesn't exist or error occurs
		return {
			agents: [],
			metadata: {
				nextId: 1,
				lastUpdated: new Date().toISOString(),
				version: '1.0.0',
			},
		}
	}

	private saveDatabase(): void {
		try {
			this.db.metadata.lastUpdated = new Date().toISOString()
			fs.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2))
		} catch (error) {
			console.error('Error saving database:', error)
		}
	}

	// Hotel Q&A keyword matching logic
	private readonly hotelQAResponses = {
		'check-in': [
			'check-in',
			'checkin',
			'check in',
			'arrival',
			'arriving',
			'when can i check in',
			'check in time',
			'checkin time',
		],
		'check-out': [
			'check-out',
			'checkout',
			'check out',
			'departure',
			'leaving',
			'when do i check out',
			'check out time',
			'checkout time',
		],
		parking: [
			'parking',
			'park',
			'car',
			'vehicle',
			'garage',
			'valet',
			'parking lot',
			'parking space',
		],
		breakfast: [
			'breakfast',
			'morning meal',
			'continental breakfast',
			'buffet',
			'dining',
			'restaurant',
			'food',
		],
		wifi: ['wifi', 'wi-fi', 'internet', 'wireless', 'connection', 'password'],
		'room-service': [
			'room service',
			'room-service',
			'delivery',
			'order food',
			'in-room dining',
		],
		amenities: [
			'amenities',
			'facilities',
			'services',
			'pool',
			'gym',
			'spa',
			'fitness',
			'laundry',
		],
		cancellation: [
			'cancel',
			'cancellation',
			'refund',
			'policy',
			'booking',
			'reservation',
		],
	}

	private readonly hotelAnswers = {
		'check-in':
			'Our check-in time is 3:00 PM. Early check-in may be available upon request and subject to availability.',
		'check-out':
			'Check-out time is 11:00 AM. Late check-out can be arranged for an additional fee, subject to availability.',
		parking:
			'We offer complimentary self-parking for all guests. Valet parking is available for $15 per night.',
		breakfast:
			'We serve a complimentary continental breakfast from 6:30 AM to 10:00 AM daily in our main dining area.',
		wifi: 'Free high-speed WiFi is available throughout the hotel. The network name is "HotelGuest" and no password is required.',
		'room-service':
			'Room service is available 24/7. You can call extension 100 from your room or use our mobile app to place orders.',
		amenities:
			'Our amenities include a fitness center, outdoor pool, business center, concierge services, and same-day laundry service.',
		cancellation:
			'Free cancellation up to 24 hours before your arrival date. Cancellations within 24 hours are subject to a one-night charge.',
	}

	getAllAgents(): Agent[] {
		return this.db.agents
	}

	getAgentById(id: string): Agent | undefined {
		return this.db.agents.find((agent: Agent) => agent.id === id)
	}

	createAgent(
		name: string,
		type: 'Sales' | 'Support' | 'Marketing',
		status: 'Active' | 'Inactive',
		description?: string
	): Agent {
		const newAgent: Agent = {
			id: this.db.metadata.nextId.toString(),
			name,
			type,
			status,
			createdAt: new Date(),
		}

		// Only add description if it's provided
		if (description !== undefined) {
			newAgent.description = description
		}

		this.db.agents.push(newAgent)
		this.db.metadata.nextId++
		this.saveDatabase()

		return newAgent
	}

	updateAgent(
		id: string,
		name?: string,
		type?: 'Sales' | 'Support' | 'Marketing',
		status?: 'Active' | 'Inactive',
		description?: string
	): Agent | null {
		const agentIndex = this.db.agents.findIndex(
			(agent: Agent) => agent.id === id
		)

		if (agentIndex === -1) {
			return null
		}

		const agent = this.db.agents[agentIndex]
		if (!agent) {
			return null
		}

		if (name) agent.name = name
		if (type) agent.type = type
		if (status) agent.status = status
		if (description !== undefined) {
			agent.description = description
		}

		this.saveDatabase()
		return agent
	}

	deleteAgent(id: string): Agent | null {
		const agentIndex = this.db.agents.findIndex(
			(agent: Agent) => agent.id === id
		)

		if (agentIndex === -1) {
			return null
		}

		const deletedAgent = this.db.agents.splice(agentIndex, 1)[0]
		this.saveDatabase()
		return deletedAgent || null
	}

	isHotelQABot(agent: Agent): boolean {
		return (
			agent.name === this.HOTEL_QA_BOT_NAME ||
			agent.name === 'The Grand Arosa Q&A Bot'
		)
	}

	processHotelQuestion(question: string): string {
		const lowerQuestion = question.toLowerCase()

		// Check each category for keyword matches
		for (const [category, keywords] of Object.entries(this.hotelQAResponses)) {
			for (const keyword of keywords) {
				if (lowerQuestion.includes(keyword.toLowerCase())) {
					return this.hotelAnswers[category as keyof typeof this.hotelAnswers]
				}
			}
		}

		// Fallback response
		return `Thank you for your question about "${question}". I'm the Hotel Q&A Bot and I can help you with information about check-in/check-out times, parking, breakfast, WiFi, room service, amenities, and cancellation policies. Please feel free to ask about any of these topics!`
	}

	processGeneralQuestion(agent: Agent, question: string): string {
		const responses = {
			Sales: {
				greeting: `Hello! I'm ${agent.name}, your Sales Assistant. I'm here to help you with product information, pricing, and sales inquiries.`,
				defaultResponse: `Thank you for your question: "${question}". As a Sales Assistant, I can help you with product information, pricing details, feature comparisons, and purchasing decisions. How can I assist you with your sales inquiry today?`,
				keywords: {
					price:
						"I'd be happy to help you with pricing information. Please let me know which specific product or service you're interested in, and I can provide you with detailed pricing options.",
					product:
						'I can provide comprehensive product information including features, specifications, and benefits. What specific product would you like to learn more about?',
					buy: "Great! I'm excited to help you with your purchase. Let me guide you through our available options and help you find the perfect solution for your needs.",
					discount:
						'I can check for any current promotions or discounts available. Let me see what special offers we have that might be perfect for you!',
					compare:
						"I'd be happy to help you compare our products and services. This will help you make the best decision based on your specific needs and budget.",
				},
			},
			Marketing: {
				greeting: `Hello! I'm ${agent.name}, your Marketing Assistant. I specialize in marketing strategies, campaigns, and brand insights.`,
				defaultResponse: `Thank you for your question: "${question}". As a Marketing Assistant, I can help you with campaign strategies, brand development, market analysis, and promotional ideas. What marketing challenge can I help you solve today?`,
				keywords: {
					campaign:
						'I can help you develop effective marketing campaigns that resonate with your target audience and drive results. What type of campaign are you looking to create?',
					brand:
						'Brand development is crucial for business success. I can assist you with brand positioning, messaging, and identity strategies that will set you apart from competitors.',
					social:
						'Social media marketing is a powerful tool! I can help you create engaging content strategies and optimize your social media presence across platforms.',
					audience:
						'Understanding your target audience is key to successful marketing. I can help you identify and analyze your ideal customers for better campaign targeting.',
					strategy:
						"I'd love to help you develop a comprehensive marketing strategy that aligns with your business goals and maximizes your ROI.",
				},
			},
			Support: {
				greeting: `Hello! I'm ${agent.name}, your Support Assistant. I'm here to help you with any questions or issues you may have.`,
				defaultResponse: `Thank you for reaching out with: "${question}". As a Support Assistant, I'm here to help resolve any issues, answer questions, and provide guidance. How can I assist you today?`,
				keywords: {
					help: "I'm here to help! Please describe your issue or question in detail, and I'll do my best to provide you with a solution or guide you to the right resources.",
					problem:
						"I understand you're experiencing an issue. Let me help you troubleshoot this. Can you provide more details about what's happening?",
					issue:
						"I'm sorry to hear you're having an issue. I'm here to help resolve this for you. Please tell me more about what you're experiencing.",
					support:
						"You've reached the right place for support! I'm here to assist you with any questions or concerns you may have.",
					error:
						"I can help you resolve this error. Please provide me with more details about when this occurs and any error messages you're seeing.",
				},
			},
		}

		const agentResponses = responses[agent.type]
		if (!agentResponses) {
			return `I'm ${agent.name}, and I'm here to help answer your questions. Please let me know how I can assist you!`
		}

		const lowerQuestion = question.toLowerCase()

		// Check for keyword matches
		for (const [keyword, response] of Object.entries(agentResponses.keywords)) {
			if (lowerQuestion.includes(keyword)) {
				return response
			}
		}

		// Return default response for the agent type
		return agentResponses.defaultResponse
	}

	// Initialize with Hotel Q&A Bot if it doesn't exist
	initializeHotelBot(): Agent {
		const existingBot = this.db.agents.find(
			(agent: Agent) => agent.name === this.HOTEL_QA_BOT_NAME
		)

		if (!existingBot) {
			return this.createAgent(
				this.HOTEL_QA_BOT_NAME,
				'Support',
				'Active',
				'A helpful bot that answers questions about hotel services, amenities, and policies.'
			)
		}

		return existingBot
	}
}

export const agentService = new AgentService()
