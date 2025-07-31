import axios from 'axios'

// Environment variable priority: Online > Standard > Local > Default
const API_BASE_URL =
	process.env.NEXT_PUBLIC_ONLINE_BACKEND_URL ||
	process.env.NEXT_PUBLIC_BACKEND_URL ||
	process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL ||
	'http://localhost:3001'

// Log the API base URL for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
	console.log('🔗 API Base URL:', API_BASE_URL)
}

export interface Agent {
	id: string
	name: string
	description?: string
	createdAt: string
}

export interface CreateAgentRequest {
	name: string
	description?: string
}

export interface AskQuestionRequest {
	question: string
}

export interface AskQuestionResponse {
	agentId: string
	agentName: string
	question: string
	answer: string
	timestamp: string
}

class ApiService {
	private client = axios.create({
		baseURL: `${API_BASE_URL}/api`,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	// Get all agents
	async getAgents(): Promise<Agent[]> {
		const response = await this.client.get<Agent[]>('/agents')
		return response.data
	}

	// Create a new agent
	async createAgent(agent: CreateAgentRequest): Promise<Agent> {
		const response = await this.client.post<Agent>('/agents', agent)
		return response.data
	}

	// Get a specific agent
	async getAgent(id: string): Promise<Agent> {
		const response = await this.client.get<Agent>(`/agents/${id}`)
		return response.data
	}

	// Update an agent
	async updateAgent(
		id: string,
		agent: Partial<CreateAgentRequest>
	): Promise<Agent> {
		const response = await this.client.put<Agent>(`/agents/${id}`, agent)
		return response.data
	}

	// Delete an agent
	async deleteAgent(id: string): Promise<Agent> {
		const response = await this.client.delete<Agent>(`/agents/${id}`)
		return response.data
	}

	// Ask a question to an agent (Hotel Q&A Bot only)
	async askQuestion(
		agentId: string,
		question: string
	): Promise<AskQuestionResponse> {
		const response = await this.client.post<AskQuestionResponse>(
			`/agents/${agentId}/ask`,
			{ question }
		)
		return response.data
	}

	// Health check
	async healthCheck(): Promise<{
		status: string
		timestamp: string
		service: string
	}> {
		const response = await this.client.get('/health')
		return response.data
	}
}

export const apiService = new ApiService()
