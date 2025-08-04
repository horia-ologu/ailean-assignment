import { agentService } from '../services/AgentService'
import { Agent } from '../models/Agent'
import * as fs from 'fs'

// Mock file system operations
jest.mock('fs')
const mockFs = fs as jest.Mocked<typeof fs>

describe('AgentService Q&A Matching Logic', () => {
	let mockDbData: any
	let hotelBot: Agent
	let salesAgent: Agent

	beforeEach(() => {
		// Setup mock database
		mockDbData = {
			agents: [
				{
					id: '1',
					name: 'Hotel Q&A Bot',
					type: 'Support',
					status: 'Active',
					description: 'Hotel Q&A Bot for testing',
					createdAt: new Date('2025-08-01T12:00:00.000Z'),
				},
				{
					id: '2',
					name: 'Sales Agent',
					type: 'Sales',
					status: 'Active',
					description: 'Sales agent for testing',
					createdAt: new Date('2025-08-01T12:00:00.000Z'),
				},
			],
			metadata: {
				nextId: 3,
				lastUpdated: '2025-08-01T12:00:00.000Z',
				version: '1.0.0',
			},
		}

		// Mock file system operations
		mockFs.existsSync.mockReturnValue(true)
		mockFs.readFileSync.mockReturnValue(JSON.stringify(mockDbData))
		mockFs.writeFileSync.mockImplementation(() => {})

		// Create test agents
		hotelBot = mockDbData.agents[0]
		salesAgent = mockDbData.agents[1]
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('isHotelQABot', () => {
		it('should identify Hotel Q&A Bot correctly', () => {
			const result = agentService.isHotelQABot(hotelBot)
			expect(result).toBe(true)
		})

		it('should not identify non-hotel bots', () => {
			const result = agentService.isHotelQABot(salesAgent)
			expect(result).toBe(false)
		})
	})

	describe('processHotelQuestion', () => {
		it('should handle check-in questions', () => {
			const result = agentService.processHotelQuestion('What time is check-in?')
			expect(result).toContain('check-in time is 3:00 PM')
			expect(result).toContain('Early check-in may be available')
		})

		it('should handle parking questions', () => {
			const result = agentService.processHotelQuestion(
				'Is there parking available?'
			)
			expect(result).toContain('complimentary self-parking')
			expect(result).toContain('Valet parking is available')
		})

		it('should handle breakfast questions', () => {
			const result = agentService.processHotelQuestion(
				'Do you serve breakfast?'
			)
			expect(result).toContain('continental breakfast')
			expect(result).toContain('6:30 AM to 10:00 AM')
		})

		it('should handle WiFi questions', () => {
			const result = agentService.processHotelQuestion('Is there WiFi?')
			expect(result).toContain('Free high-speed WiFi')
			expect(result).toContain('HotelGuest')
		})

		it('should provide fallback response for unrecognized questions', () => {
			const question = 'What is the meaning of life?'
			const result = agentService.processHotelQuestion(question)
			expect(result).toContain('Thank you for your question')
			expect(result).toContain('Hotel Q&A Bot')
		})
	})

	describe('processGeneralQuestion', () => {
		it('should handle sales questions with keywords', () => {
			const result = agentService.processGeneralQuestion(
				salesAgent,
				'What are your prices?'
			)
			expect(result).toBeDefined()
			expect(result.length).toBeGreaterThan(0)
			expect(result.toLowerCase()).toContain('pricing')
		})

		it('should provide default sales response for non-keyword questions', () => {
			const question = 'Hello there'
			const result = agentService.processGeneralQuestion(salesAgent, question)
			expect(result).toContain('Sales Assistant')
			expect(result).toContain('product information')
		})
	})

	describe('CRUD Operations', () => {
		it('should create a new agent', () => {
			const newAgent = agentService.createAgent(
				'Test Agent',
				'Sales',
				'Active',
				'Test description'
			)

			expect(newAgent).toBeDefined()
			expect(newAgent.name).toBe('Test Agent')
			expect(newAgent.type).toBe('Sales')
			expect(newAgent.status).toBe('Active')
			expect(newAgent.description).toBe('Test description')
		})

		it('should get all agents', () => {
			const agents = agentService.getAllAgents()
			expect(agents).toBeDefined()
			expect(Array.isArray(agents)).toBe(true)
		})
	})

	describe('Edge Cases', () => {
		it('should handle empty questions gracefully', () => {
			const result = agentService.processHotelQuestion('')
			expect(result).toContain('Thank you for your question')
		})

		it('should handle case-insensitive keyword matching', () => {
			const result1 = agentService.processHotelQuestion('CHECK-IN TIME?')
			const result2 = agentService.processHotelQuestion('check-in time?')
			expect(result1).toBe(result2)
		})
	})
})
