'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiService, Agent, CreateAgentRequest } from '../services/api'

export default function Home() {
	const [agents, setAgents] = useState<Agent[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const chatEndRef = useRef<HTMLDivElement>(null)

	// Utility function to check if an agent is a hotel bot
	const isHotelBot = (agent: Agent) => {
		return (
			agent.name === 'Hotel Q&A Bot' || agent.name === 'The Grand Arosa Q&A Bot'
		)
	}

	// Form state for creating new agents
	const [newAgentName, setNewAgentName] = useState('')
	const [newAgentType, setNewAgentType] = useState<
		'Sales' | 'Support' | 'Marketing'
	>('Sales')
	const [newAgentStatus, setNewAgentStatus] = useState<'Active' | 'Inactive'>(
		'Active'
	)
	const [newAgentDescription, setNewAgentDescription] = useState('')
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

	// Auto-scroll to bottom when chat history changes
	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [chatHistory, askingQuestion])

	// Handle agent selection for chat
	const handleAgentSelection = (agentId: string) => {
		const agent = agents.find((a) => a.id === agentId)
		setSelectedAgentId(agentId)
		setSelectedAgentForChat(agent || null)
		// Clear chat history when switching agents
		setChatHistory([])
	}

	// Create a new agent
	const handleCreateAgent = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!newAgentName.trim()) return

		try {
			setCreating(true)
			const createAgentData: CreateAgentRequest = {
				name: newAgentName,
				type: newAgentType,
				status: newAgentStatus,
			}

			if (newAgentDescription.trim()) {
				createAgentData.description = newAgentDescription
			}

			const newAgent = await apiService.createAgent(createAgentData)
			setAgents((prev) => [...prev, newAgent])
			setNewAgentName('')
			setNewAgentType('Sales')
			setNewAgentStatus('Active')
			setNewAgentDescription('')
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
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-xl text-gray-600'>Loading agents...</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-6xl mx-auto px-4'>
				<h1 className='text-4xl font-bold text-gray-900 mb-8 text-center'>
					Agent Management System
				</h1>

				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
						{error}
						<button
							onClick={() => setError(null)}
							className='float-right text-red-500 hover:text-red-700'
						>
							×
						</button>
					</div>
				)}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Agent Management Section */}
					<div className='bg-white rounded-lg shadow-md p-6'>
						<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
							Agent Management
						</h2>

						{/* Create Agent Form */}
						<form onSubmit={handleCreateAgent} className='mb-6'>
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Agent Name
								</label>
								<input
									type='text'
									value={newAgentName}
									onChange={(e) => setNewAgentName(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
									placeholder='Enter agent name'
									required
								/>
							</div>
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Agent Type
								</label>
								<select
									value={newAgentType}
									onChange={(e) =>
										setNewAgentType(
											e.target.value as 'Sales' | 'Support' | 'Marketing'
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
									required
								>
									<option value='Sales'>Sales</option>
									<option value='Support'>Support</option>
									<option value='Marketing'>Marketing</option>
								</select>
							</div>
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Agent Status
								</label>
								<select
									value={newAgentStatus}
									onChange={(e) =>
										setNewAgentStatus(e.target.value as 'Active' | 'Inactive')
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
									required
								>
									<option value='Active'>Active</option>
									<option value='Inactive'>Inactive</option>
								</select>
							</div>
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Description (optional)
								</label>
								<textarea
									value={newAgentDescription}
									onChange={(e) => setNewAgentDescription(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
									placeholder='Enter agent description'
									rows={3}
								/>
							</div>
							<button
								type='submit'
								disabled={creating}
								className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{creating ? 'Creating...' : 'Create Agent'}
							</button>
						</form>

						{/* Agents List */}
						<div>
							<h3 className='text-lg font-medium text-gray-800 mb-4'>
								Current Agents
							</h3>
							{agents.length === 0 ? (
								<p className='text-gray-500'>No agents found.</p>
							) : (
								<div className='space-y-3'>
									{agents.map((agent) => (
										<div
											key={agent.id}
											className='border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors'
											onClick={() => openAgentModal(agent)}
										>
											<div className='flex justify-between items-start'>
												<div className='flex-1'>
													<h4 className='font-medium text-gray-900'>
														{agent.name}
														{isHotelBot(agent) && (
															<span className='ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
																Hotel Bot
															</span>
														)}
													</h4>
													<div className='flex gap-2 mt-1'>
														<span
															className={`text-xs px-2 py-1 rounded ${
																agent.type === 'Sales'
																	? 'bg-blue-100 text-blue-800'
																	: agent.type === 'Support'
																	? 'bg-purple-100 text-purple-800'
																	: 'bg-orange-100 text-orange-800'
															}`}
														>
															{agent.type}
														</span>
														<span
															className={`text-xs px-2 py-1 rounded ${
																agent.status === 'Active'
																	? 'bg-green-100 text-green-800'
																	: 'bg-gray-100 text-gray-800'
															}`}
														>
															{agent.status}
														</span>
													</div>
													{agent.description && (
														<p className='text-sm text-gray-600 mt-1 line-clamp-2'>
															{agent.description}
														</p>
													)}
													<p className='text-xs text-gray-400 mt-2'>
														Created:{' '}
														{new Date(agent.createdAt).toLocaleDateString()}
													</p>
												</div>
												{!isHotelBot(agent) && (
													<button
														onClick={(e) => {
															e.stopPropagation()
															openDeleteModal(agent)
														}}
														className='text-red-500 hover:text-red-700 text-sm'
													>
														Delete
													</button>
												)}
												{isHotelBot(agent) && (
													<span className='text-xs text-green-600 bg-green-50 px-2 py-1 rounded'>
														Protected
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Agent Chat Section */}
					<div className='bg-white rounded-lg shadow-md p-6'>
						<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
							Agent Chat
						</h2>

						{/* Agent Selection */}
						<div className='mb-6'>
							<label
								htmlFor='agent-select'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Select Agent:
							</label>
							<select
								id='agent-select'
								value={selectedAgentId || ''}
								onChange={(e) => handleAgentSelection(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
							>
								<option value=''>Choose an agent...</option>
								{agents.map((agent) => (
									<option key={agent.id} value={agent.id}>
										{agent.name}
									</option>
								))}
							</select>
						</div>

						{selectedAgentForChat ? (
							<div>
								{/* Selected Agent Info */}
								<div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
									<div className='flex items-center'>
										<div className='text-2xl mr-3'>
											{isHotelBot(selectedAgentForChat) ? '🏨' : '🤖'}
										</div>
										<div>
											<h3 className='font-semibold text-blue-900'>
												{selectedAgentForChat.name}
											</h3>
											<p className='text-sm text-blue-700'>
												{selectedAgentForChat.description ||
													'No description available'}
											</p>
										</div>
									</div>
								</div>

								{/* Chat History */}
								<div className='bg-gray-50 border rounded-lg p-4 mb-4 h-96 overflow-y-auto'>
									{chatHistory.length === 0 ? (
										<div className='text-center text-gray-500 mt-8'>
											<div className='text-4xl mb-2'>
												{isHotelBot(selectedAgentForChat) ? '🏨' : '💬'}
											</div>
											<p>Welcome to {selectedAgentForChat.name}!</p>
											<p className='text-sm'>
												{isHotelBot(selectedAgentForChat)
													? 'Ask me anything about our hotel services.'
													: 'Start a conversation with this agent.'}
											</p>
										</div>
									) : (
										<div className='space-y-4'>
											{chatHistory.map((message) => (
												<div
													key={message.id}
													className={`flex ${
														message.type === 'user'
															? 'justify-end'
															: 'justify-start'
													}`}
												>
													<div
														className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
															message.type === 'user'
																? 'bg-blue-500 text-white'
																: 'bg-white border border-gray-200 text-gray-800'
														}`}
													>
														<p className='text-sm'>{message.message}</p>
														<p
															className={`text-xs mt-1 ${
																message.type === 'user'
																	? 'text-blue-100'
																	: 'text-gray-400'
															}`}
														>
															{new Date(message.timestamp).toLocaleTimeString()}
														</p>
													</div>
												</div>
											))}
											{askingQuestion && (
												<div className='flex justify-start'>
													<div className='bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg'>
														<div className='flex items-center space-x-1'>
															<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
															<div
																className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
																style={{ animationDelay: '0.1s' }}
															></div>
															<div
																className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
																style={{ animationDelay: '0.2s' }}
															></div>
														</div>
													</div>
												</div>
											)}
											<div ref={chatEndRef} />
										</div>
									)}
								</div>

								{/* Chat Input */}
								<form onSubmit={handleAskQuestion} className='mb-6'>
									<div className='flex space-x-2'>
										<textarea
											value={question}
											onChange={(e) => setQuestion(e.target.value)}
											className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none'
											placeholder='Ask about check-in times, amenities, room service...'
											rows={2}
											required
											onKeyPress={(e) => {
												if (e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault()
													handleAskQuestion(e)
												}
											}}
										/>
										<button
											type='submit'
											disabled={askingQuestion || !question.trim()}
											className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
										>
											<svg
												className='w-5 h-5'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
												/>
											</svg>
										</button>
									</div>
								</form>

								<div className='text-sm text-gray-600'>
									<h4 className='font-medium mb-2'>💬 Try asking about:</h4>
									<div className='grid grid-cols-2 gap-2'>
										{isHotelBot(selectedAgentForChat) ? (
											<>
												<button
													onClick={() =>
														setQuestion('What are your check-in times?')
													}
													className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
												>
													⏰ Check-in times
												</button>
												<button
													onClick={() =>
														setQuestion('Do you have room service?')
													}
													className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
												>
													🍽️ Room service
												</button>
												<button
													onClick={() => setQuestion('Is there free WiFi?')}
													className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
												>
													📶 WiFi information
												</button>
												<button
													onClick={() =>
														setQuestion('What amenities do you have?')
													}
													className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
												>
													🏊 Hotel amenities
												</button>
											</>
										) : (
											<>
												<button
													onClick={() => setQuestion('Hello!')}
													className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
												>
													👋 Say hello
												</button>
												<button
													onClick={() => setQuestion('How can you help me?')}
													className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
												>
													❓ Get help
												</button>
												<button
													onClick={() => setQuestion('What can you do?')}
													className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
												>
													🔧 Learn capabilities
												</button>
												<button
													onClick={() => setQuestion('Tell me about yourself')}
													className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
												>
													ℹ️ About agent
												</button>
											</>
										)}
									</div>
								</div>
							</div>
						) : (
							<div className='text-center text-gray-500 py-8'>
								<div className='text-4xl mb-4'>🤖</div>
								<p className='text-lg font-medium mb-2'>No agent selected</p>
								<p className='text-sm'>
									Please select an agent from the dropdown above to start
									chatting.
								</p>
								{agents.length === 0 && (
									<div className='mt-4'>
										<p className='text-sm text-gray-400 mb-2'>
											No agents available. Create one first!
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Connection Status */}
				<div className='mt-8 text-center text-sm text-gray-500'>
					Backend URL:{' '}
					{process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}
				</div>

				{/* Agent Details Modal */}
				{showModal && selectedAgent && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
						<div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
							{/* Modal Header */}
							<div className='flex justify-between items-center p-6 border-b'>
								<h3 className='text-2xl font-semibold text-gray-900'>
									Agent Details
								</h3>
								<button
									onClick={closeAgentModal}
									className='text-gray-400 hover:text-gray-600 transition-colors'
								>
									<svg
										className='w-6 h-6'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								</button>
							</div>

							{/* Modal Body */}
							<div className='p-6'>
								<div className='space-y-6'>
									{/* Agent Name */}
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Agent Name
										</label>
										<div className='flex items-center'>
											<p className='text-lg font-semibold text-gray-900'>
												{selectedAgent.name}
											</p>
											{isHotelBot(selectedAgent) && (
												<span className='ml-3 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full'>
													🏨 Hotel Bot
												</span>
											)}
										</div>
									</div>

									{/* Agent Type and Status */}
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Type
											</label>
											<span
												className={`inline-block px-3 py-2 rounded-full text-sm font-medium ${
													selectedAgent.type === 'Sales'
														? 'bg-blue-100 text-blue-800'
														: selectedAgent.type === 'Support'
														? 'bg-purple-100 text-purple-800'
														: 'bg-orange-100 text-orange-800'
												}`}
											>
												{selectedAgent.type}
											</span>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Status
											</label>
											<span
												className={`inline-block px-3 py-2 rounded-full text-sm font-medium ${
													selectedAgent.status === 'Active'
														? 'bg-green-100 text-green-800'
														: 'bg-gray-100 text-gray-800'
												}`}
											>
												{selectedAgent.status}
											</span>
										</div>
									</div>

									{/* Agent ID */}
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Agent ID
										</label>
										<p className='text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded border'>
											{selectedAgent.id}
										</p>
									</div>

									{/* Description */}
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Description
										</label>
										{selectedAgent.description ? (
											<p className='text-gray-700 bg-gray-50 px-4 py-3 rounded border leading-relaxed'>
												{selectedAgent.description}
											</p>
										) : (
											<p className='text-gray-500 italic'>
												No description provided
											</p>
										)}
									</div>

									{/* Creation Date */}
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Created At
										</label>
										<div className='text-gray-700'>
											<p className='font-medium'>
												{new Date(selectedAgent.createdAt).toLocaleDateString(
													'en-US',
													{
														weekday: 'long',
														year: 'numeric',
														month: 'long',
														day: 'numeric',
													}
												)}
											</p>
											<p className='text-sm text-gray-500'>
												{new Date(selectedAgent.createdAt).toLocaleTimeString(
													'en-US',
													{
														hour: '2-digit',
														minute: '2-digit',
														second: '2-digit',
													}
												)}
											</p>
										</div>
									</div>

									{/* Agent Type */}
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Agent Type
										</label>
										<div className='flex items-center space-x-2'>
											{isHotelBot(selectedAgent) ? (
												<>
													<span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'>
														🤖 Q&A Bot
													</span>
													<span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'>
														🏨 Hotel Services
													</span>
												</>
											) : (
												<span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'>
													👤 Custom Agent
												</span>
											)}
										</div>
									</div>

									{/* Capabilities (for Hotel Q&A Bot) */}
									{isHotelBot(selectedAgent) && (
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Bot Capabilities
											</label>
											<div className='grid grid-cols-2 gap-3'>
												<div className='bg-blue-50 p-3 rounded border'>
													<div className='text-blue-600 text-sm font-medium'>
														⏰ Check-in/out
													</div>
													<div className='text-blue-500 text-xs'>
														Operating hours & procedures
													</div>
												</div>
												<div className='bg-green-50 p-3 rounded border'>
													<div className='text-green-600 text-sm font-medium'>
														🍽️ Room Service
													</div>
													<div className='text-green-500 text-xs'>
														Menu & availability
													</div>
												</div>
												<div className='bg-purple-50 p-3 rounded border'>
													<div className='text-purple-600 text-sm font-medium'>
														📶 WiFi & Tech
													</div>
													<div className='text-purple-500 text-xs'>
														Internet & connectivity
													</div>
												</div>
												<div className='bg-orange-50 p-3 rounded border'>
													<div className='text-orange-600 text-sm font-medium'>
														🏊 Amenities
													</div>
													<div className='text-orange-500 text-xs'>
														Pool, gym, spa services
													</div>
												</div>
												<div className='bg-red-50 p-3 rounded border'>
													<div className='text-red-600 text-sm font-medium'>
														🚗 Parking
													</div>
													<div className='text-red-500 text-xs'>
														Availability & pricing
													</div>
												</div>
												<div className='bg-yellow-50 p-3 rounded border'>
													<div className='text-yellow-600 text-sm font-medium'>
														📋 Policies
													</div>
													<div className='text-yellow-500 text-xs'>
														Cancellation & rules
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Modal Footer */}
							<div className='flex justify-between items-center p-6 border-t bg-gray-50'>
								<button
									onClick={closeAgentModal}
									className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
								>
									Close
								</button>
								<button
									onClick={() => {
										openDeleteModal(selectedAgent)
										closeAgentModal()
									}}
									className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
								>
									Delete Agent
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Delete Confirmation Modal */}
				{showDeleteModal && agentToDelete && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
						<div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
							{/* Modal Header */}
							<div className='flex justify-between items-center p-6 border-b'>
								<h2 className='text-xl font-semibold text-red-600'>
									Confirm Deletion
								</h2>
								<button
									onClick={closeDeleteModal}
									className='text-gray-400 hover:text-gray-600 text-2xl'
								>
									×
								</button>
							</div>

							{/* Modal Body */}
							<div className='p-6'>
								<div className='flex items-start space-x-4'>
									<div className='flex-shrink-0'>
										<div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
											<svg
												className='w-6 h-6 text-red-600'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
												/>
											</svg>
										</div>
									</div>
									<div className='flex-1'>
										<h3 className='text-lg font-medium text-gray-900 mb-2'>
											Delete Agent &ldquo;{agentToDelete.name}&rdquo;
										</h3>
										<div className='flex gap-2 mb-3'>
											<span
												className={`text-xs px-2 py-1 rounded ${
													agentToDelete.type === 'Sales'
														? 'bg-blue-100 text-blue-800'
														: agentToDelete.type === 'Support'
														? 'bg-purple-100 text-purple-800'
														: 'bg-orange-100 text-orange-800'
												}`}
											>
												{agentToDelete.type}
											</span>
											<span
												className={`text-xs px-2 py-1 rounded ${
													agentToDelete.status === 'Active'
														? 'bg-green-100 text-green-800'
														: 'bg-gray-100 text-gray-800'
												}`}
											>
												{agentToDelete.status}
											</span>
										</div>
										<p className='text-sm text-gray-600 mb-4'>
											Are you sure you want to delete this agent? This action
											cannot be undone.
										</p>
										{agentToDelete.description && (
											<div className='bg-gray-50 p-3 rounded border'>
												<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
													Agent Description
												</p>
												<p className='text-sm text-gray-700'>
													{agentToDelete.description}
												</p>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Modal Footer */}
							<div className='flex justify-end space-x-3 p-6 border-t bg-gray-50'>
								<button
									onClick={closeDeleteModal}
									className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors'
								>
									Cancel
								</button>
								<button
									onClick={confirmDelete}
									className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium transition-colors'
								>
									Delete Agent
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
