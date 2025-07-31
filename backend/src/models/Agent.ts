export interface Agent {
	id: string
	name: string
	description?: string
	createdAt: Date
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
	timestamp: Date
}
