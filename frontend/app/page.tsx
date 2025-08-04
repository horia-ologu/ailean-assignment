'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiService, Agent, CreateAgentRequest } from '../services/api'
import {
	ErrorAlert,
	LoadingSpinner,
	AgentChat,
	AgentManagement,
	AgentModal,
	DeleteConfirmationModal,
} from '../components'

export default function Home() {
	const [agents, setAgents] = useState<Agent[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Utility function to check if an agent is a hotel bot
	const isHotelBot = (agent: Agent) => {
		return (
			agent.name === 'Hotel Q&A Bot' || agent.name === 'The Grand Arosa Q&A Bot'
		)
	}

	const [creating, setCreating] = useState(false)

	// Chat state with agent selection
	const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
	const [selectedAgentForChat, setSelectedAgentForChat] =
		useState<Agent | null>(null)
	const [question, setQuestion] = useState('')
	const [chatHistory, setChatHistory] = useState<
		Array<{
			id: string
			type: 'user' | 'bot'
			message: string
			timestamp: string
		}>
	>([])
	const [askingQuestion, setAskingQuestion] = useState(false)

	// Modal state for agent details
	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
	const [showModal, setShowModal] = useState(false)

	// Delete confirmation modal state
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null)

	// Accordion state for create agent form
	const [showCreateForm, setShowCreateForm] = useState(false)

	// Create the hardcoded Hotel Q&A Bot
	const createHotelBot = useCallback(async () => {
		try {
			const hotelBot = await apiService.createAgent({
				name: 'The Grand Arosa Q&A Bot',
				type: 'Support',
				status: 'Active',
				description:
					'A helpful bot that answers questions about The Grand Arosa hotel services, amenities, and policies.',
			})
			setAgents((prev) => [...prev, hotelBot])
			// Auto-select the hotel bot as the default agent for chat
			setSelectedAgentId(hotelBot.id)
			setSelectedAgentForChat(hotelBot)
		} catch (err) {
			console.error('Error creating Hotel Q&A Bot:', err)
		}
	}, [])

	// Load agents and check for Hotel Q&A Bot
	const loadAgents = useCallback(async () => {
		try {
			setLoading(true)
			const agentsData = await apiService.getAgents()
			setAgents(agentsData)

			// Check if The Grand Arosa Q&A Bot exists, if not create it
			const hotelBot = agentsData.find((agent) => isHotelBot(agent))
			if (hotelBot) {
				setSelectedAgentId(hotelBot.id)
				setSelectedAgentForChat(hotelBot)
			} else {
				await createHotelBot()
			}
		} catch (err) {
			setError(
				'Failed to load agents. Make sure the backend server is running.'
			)
			console.error('Error loading agents:', err)
		} finally {
			setLoading(false)
		}
	}, [createHotelBot])

	// Load agents on component mount
	useEffect(() => {
		loadAgents()
	}, [loadAgents])

	// Handle agent selection for chat
	const handleAgentSelection = (agentId: string) => {
		const agent = agents.find((a) => a.id === agentId)
		setSelectedAgentId(agentId)
		setSelectedAgentForChat(agent || null)
		// Clear chat history when switching agents
		setChatHistory([])
	}

	// Create a new agent
	const onSubmitCreateAgent = async (data: CreateAgentRequest) => {
		try {
			setCreating(true)
			const createAgentData: CreateAgentRequest = {
				name: data.name,
				type: data.type,
				status: data.status,
			}

			if (data.description?.trim()) {
				createAgentData.description = data.description
			}

			const newAgent = await apiService.createAgent(createAgentData)
			setAgents((prev) => [...prev, newAgent])
			// Reset will be handled by the component
			setShowCreateForm(false) // Close the accordion after successful creation
		} catch (err) {
			setError('Failed to create agent')
			console.error('Error creating agent:', err)
		} finally {
			setCreating(false)
		}
	}

	// Ask a question to the selected agent
	const handleAskQuestion = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!question.trim() || !selectedAgentId) return

		const userMessage = {
			id: Date.now().toString(),
			type: 'user' as const,
			message: question,
			timestamp: new Date().toISOString(),
		}

		// Add user message to chat
		setChatHistory((prev) => [...prev, userMessage])
		const currentQuestion = question
		setQuestion('')

		try {
			setAskingQuestion(true)
			const response = await apiService.askQuestion(
				selectedAgentId,
				currentQuestion
			)

			// Add bot response to chat
			const botMessage = {
				id: (Date.now() + 1).toString(),
				type: 'bot' as const,
				message: response.answer,
				timestamp: new Date().toISOString(),
			}
			setChatHistory((prev) => [...prev, botMessage])
		} catch (err: any) {
			console.error('Error asking question:', err)

			let errorMessage = 'Sorry, I encountered an error. Please try again.'

			// Handle specific error cases
			if (err.response?.status === 403) {
				const errorData = err.response.data
				if (errorData.status === 'Inactive') {
					errorMessage = `Sorry, I'm currently inactive and cannot answer questions right now.`
				} else if (errorData.error) {
					errorMessage = errorData.error
				}
			} else if (err.response?.status === 404) {
				errorMessage = 'Agent not found. Please select a different agent.'
			} else if (err.response?.status >= 500) {
				errorMessage = 'Server error. Please try again in a moment.'
			}

			setError('Failed to ask question')

			// Add error message to chat
			const errorChatMessage = {
				id: (Date.now() + 1).toString(),
				type: 'bot' as const,
				message: errorMessage,
				timestamp: new Date().toISOString(),
			}
			setChatHistory((prev) => [...prev, errorChatMessage])
		} finally {
			setAskingQuestion(false)
		}
	}

	// Delete an agent
	const handleDeleteAgent = useCallback(
		async (id: string) => {
			try {
				await apiService.deleteAgent(id)
				setAgents((prev) => prev.filter((agent) => agent.id !== id))

				// If the deleted agent was selected for chat, clear selection
				if (id === selectedAgentId) {
					setSelectedAgentId(null)
					setSelectedAgentForChat(null)
					setChatHistory([])
				}
			} catch (err) {
				setError('Failed to delete agent')
				console.error('Error deleting agent:', err)
			} finally {
				// Close delete modal
				setShowDeleteModal(false)
				setAgentToDelete(null)
			}
		},
		[selectedAgentId]
	)

	// Open delete confirmation modal
	const openDeleteModal = (agent: Agent) => {
		setAgentToDelete(agent)
		setShowDeleteModal(true)
	}

	// Close delete confirmation modal
	const closeDeleteModal = () => {
		setShowDeleteModal(false)
		setAgentToDelete(null)
	}

	// Confirm delete action
	const confirmDelete = useCallback(() => {
		if (agentToDelete) {
			handleDeleteAgent(agentToDelete.id)
		}
	}, [agentToDelete, handleDeleteAgent])

	// Handle keyboard events for delete modal
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (showDeleteModal) {
				if (event.key === 'Escape') {
					setShowDeleteModal(false)
					setAgentToDelete(null)
				} else if (event.key === 'Enter') {
					if (agentToDelete) {
						confirmDelete()
					}
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [showDeleteModal, agentToDelete, confirmDelete])

	// Open agent details modal
	const openAgentModal = (agent: Agent) => {
		setSelectedAgent(agent)
		setShowModal(true)
	}

	// Close agent details modal
	const closeAgentModal = () => {
		setSelectedAgent(null)
		setShowModal(false)
	}

	if (loading) {
		return <LoadingSpinner />
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-6xl mx-auto px-4'>
				<h1 className='text-4xl font-bold text-gray-900 mb-8 text-center'>
					Agent Management System
				</h1>

				{error && <ErrorAlert error={error} onClose={() => setError(null)} />}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Agent Chat Section */}
					<AgentChat
						agents={agents}
						selectedAgentId={selectedAgentId}
						selectedAgentForChat={selectedAgentForChat}
						isHotelBot={isHotelBot}
						onAgentSelection={handleAgentSelection}
						question={question}
						setQuestion={setQuestion}
						chatHistory={chatHistory}
						askingQuestion={askingQuestion}
						onAskQuestion={handleAskQuestion}
					/>

					{/* Agent Management Section */}
					<AgentManagement
						agents={agents}
						isHotelBot={isHotelBot}
						showCreateForm={showCreateForm}
						setShowCreateForm={setShowCreateForm}
						onCreateAgent={onSubmitCreateAgent}
						onAgentClick={openAgentModal}
						onDeleteClick={openDeleteModal}
						isCreating={creating}
					/>
				</div>

				{/* Connection Status */}
				<div className='mt-8 text-center text-sm text-gray-500'>
					Backend URL:{' '}
					{process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}
				</div>

				{/* Agent Details Modal */}
				{showModal && selectedAgent && (
					<AgentModal
						agent={selectedAgent}
						isHotelBot={isHotelBot}
						onClose={closeAgentModal}
						onDelete={openDeleteModal}
					/>
				)}

				{/* Delete Confirmation Modal */}
				{showDeleteModal && agentToDelete && (
					<DeleteConfirmationModal
						agent={agentToDelete}
						onClose={closeDeleteModal}
						onConfirm={confirmDelete}
					/>
				)}
			</div>
		</div>
	)
}
