import { Agent } from '../models/Agent'

class AgentService {
	private agents: Agent[] = []
	private nextId = 1
	private readonly HOTEL_QA_BOT_NAME = 'Hotel Q&A Bot'

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
		return this.agents
	}

	getAgentById(id: string): Agent | undefined {
		return this.agents.find((agent) => agent.id === id)
	}

	createAgent(name: string, description?: string): Agent {
		const newAgent: Agent = {
			id: this.nextId.toString(),
			name,
			description,
			createdAt: new Date(),
		}

		this.agents.push(newAgent)
		this.nextId++

		return newAgent
	}

	updateAgent(id: string, name?: string, description?: string): Agent | null {
		const agentIndex = this.agents.findIndex((agent) => agent.id === id)

		if (agentIndex === -1) {
			return null
		}

		if (name) this.agents[agentIndex].name = name
		if (description !== undefined)
			this.agents[agentIndex].description = description

		return this.agents[agentIndex]
	}

	deleteAgent(id: string): Agent | null {
		const agentIndex = this.agents.findIndex((agent) => agent.id === id)

		if (agentIndex === -1) {
			return null
		}

		return this.agents.splice(agentIndex, 1)[0]
	}

	isHotelQABot(agent: Agent): boolean {
		return agent.name === this.HOTEL_QA_BOT_NAME
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

	// Initialize with Hotel Q&A Bot if it doesn't exist
	initializeHotelBot(): Agent {
		const existingBot = this.agents.find(
			(agent) => agent.name === this.HOTEL_QA_BOT_NAME
		)

		if (!existingBot) {
			return this.createAgent(
				this.HOTEL_QA_BOT_NAME,
				'A helpful bot that answers questions about hotel services, amenities, and policies.'
			)
		}

		return existingBot
	}
}

export const agentService = new AgentService()
