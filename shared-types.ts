// Shared types between frontend and backend
// These types represent the API contract

export interface Agent {
	id: string
	name: string
	type: 'Sales' | 'Support' | 'Marketing'
	status: 'Active' | 'Inactive'
	description?: string
	createdAt: string // ISO date string for API transport
}

export interface CreateAgentRequest {
	name: string
	type: 'Sales' | 'Support' | 'Marketing'
	status: 'Active' | 'Inactive'
	description?: string
}

export interface UpdateAgentRequest {
	name?: string
	type?: 'Sales' | 'Support' | 'Marketing'
	status?: 'Active' | 'Inactive'
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
	timestamp: string // ISO date string for API transport
}

export interface HealthCheckResponse {
	status: string
	timestamp: string
	service: string
}

// Backend-only types (with actual Date objects)
export interface AgentEntity {
	id: string
	name: string
	type: 'Sales' | 'Support' | 'Marketing'
	status: 'Active' | 'Inactive'
	description?: string
	createdAt: Date // Actual Date object in backend
}

export interface AskQuestionResponseEntity {
	agentId: string
	agentName: string
	question: string
	answer: string
	timestamp: Date // Actual Date object in backend
}

// Type guards for runtime type checking
export function isValidAgentType(type: string): type is Agent['type'] {
	return ['Sales', 'Support', 'Marketing'].includes(type)
}

export function isValidAgentStatus(status: string): status is Agent['status'] {
	return ['Active', 'Inactive'].includes(status)
}

// Utility types for better type safety
export type AgentType = Agent['type']
export type AgentStatus = Agent['status']
