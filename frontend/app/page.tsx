'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiService, Agent } from '../services/api'

export default function Home() {
	const [agents, setAgents] = useState<Agent[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Form state for creating new agents
	const [newAgentName, setNewAgentName] = useState('')
	const [newAgentDescription, setNewAgentDescription] = useState('')
	const [creating, setCreating] = useState(false)

	// Hardcoded Hotel Q&A Bot
	const [hotelBotId, setHotelBotId] = useState<string | null>(null)
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

	// Create the hardcoded Hotel Q&A Bot
	const createHotelBot = useCallback(async () => {
		try {
			const hotelBot = await apiService.createAgent({
				name: 'Hotel Q&A Bot',
				description:
					'A helpful bot that answers questions about hotel services, amenities, and policies.',
			})
			setHotelBotId(hotelBot.id)
			setAgents((prev) => [...prev, hotelBot])
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

			// Check if Hotel Q&A Bot exists, if not create it
			const hotelBot = agentsData.find(
				(agent) => agent.name === 'Hotel Q&A Bot'
			)
			if (hotelBot) {
				setHotelBotId(hotelBot.id)
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

	// Create a new agent
	const handleCreateAgent = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!newAgentName.trim()) return

		try {
			setCreating(true)
			const newAgent = await apiService.createAgent({
				name: newAgentName,
				description: newAgentDescription || undefined,
			})
			setAgents((prev) => [...prev, newAgent])
			setNewAgentName('')
			setNewAgentDescription('')
		} catch (err) {
			setError('Failed to create agent')
			console.error('Error creating agent:', err)
		} finally {
			setCreating(false)
		}
	}

	// Ask a question to the Hotel Q&A Bot
	const handleAskQuestion = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!question.trim() || !hotelBotId) return

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
			const response = await apiService.askQuestion(hotelBotId, currentQuestion)

			// Add bot response to chat
			const botMessage = {
				id: (Date.now() + 1).toString(),
				type: 'bot' as const,
				message: response.answer,
				timestamp: new Date().toISOString(),
			}
			setChatHistory((prev) => [...prev, botMessage])
		} catch (err) {
			setError('Failed to ask question')
			console.error('Error asking question:', err)

			// Add error message to chat
			const errorMessage = {
				id: (Date.now() + 1).toString(),
				type: 'bot' as const,
				message: 'Sorry, I encountered an error. Please try again.',
				timestamp: new Date().toISOString(),
			}
			setChatHistory((prev) => [...prev, errorMessage])
		} finally {
			setAskingQuestion(false)
		}
	}

	// Delete an agent
	const handleDeleteAgent = async (id: string) => {
		if (!confirm('Are you sure you want to delete this agent?')) return

		try {
			await apiService.deleteAgent(id)
			setAgents((prev) => prev.filter((agent) => agent.id !== id))

			// Reset hotel bot if it was deleted
			if (id === hotelBotId) {
				setHotelBotId(null)
				setChatHistory([])
			}
		} catch (err) {
			setError('Failed to delete agent')
			console.error('Error deleting agent:', err)
		}
	}

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
														{agent.name === 'Hotel Q&A Bot' && (
															<span className='ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
																Hardcoded Bot
															</span>
														)}
													</h4>
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
												<button
													onClick={(e) => {
														e.stopPropagation()
														handleDeleteAgent(agent.id)
													}}
													className='text-red-500 hover:text-red-700 text-sm'
												>
													Delete
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Hotel Q&A Bot Section */}
					<div className='bg-white rounded-lg shadow-md p-6'>
						<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
							Hotel Q&A Bot
						</h2>

						{hotelBotId ? (
							<div>
								{/* Chat History */}
								<div className='bg-gray-50 border rounded-lg p-4 mb-4 h-96 overflow-y-auto'>
									{chatHistory.length === 0 ? (
										<div className='text-center text-gray-500 mt-8'>
											<div className='text-4xl mb-2'>🏨</div>
											<p>Welcome to Hotel Q&A Bot!</p>
											<p className='text-sm'>
												Ask me anything about our hotel services.
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
										<button
											onClick={() =>
												setQuestion('What are your check-in times?')
											}
											className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
										>
											⏰ Check-in times
										</button>
										<button
											onClick={() => setQuestion('Do you have room service?')}
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
											onClick={() => setQuestion('What amenities do you have?')}
											className='text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs'
										>
											🏊 Hotel amenities
										</button>
									</div>
								</div>
							</div>
						) : (
							<div className='text-gray-500'>
								<p>
									Hotel Q&A Bot is not available. It will be created
									automatically when the page loads.
								</p>
								<button
									onClick={createHotelBot}
									className='mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600'
								>
									Create Hotel Bot
								</button>
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
											{selectedAgent.name === 'Hotel Q&A Bot' && (
												<span className='ml-3 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full'>
													🏨 Hardcoded Bot
												</span>
											)}
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
											{selectedAgent.name === 'Hotel Q&A Bot' ? (
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
									{selectedAgent.name === 'Hotel Q&A Bot' && (
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
										if (
											confirm('Are you sure you want to delete this agent?')
										) {
											handleDeleteAgent(selectedAgent.id)
											closeAgentModal()
										}
									}}
									className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
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
