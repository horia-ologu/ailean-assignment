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
	const [botResponse, setBotResponse] = useState<string | null>(null)
	const [askingQuestion, setAskingQuestion] = useState(false)

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

		try {
			setAskingQuestion(true)
			const response = await apiService.askQuestion(hotelBotId, question)
			setBotResponse(response.answer)
			setQuestion('')
		} catch (err) {
			setError('Failed to ask question')
			console.error('Error asking question:', err)
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
				setBotResponse(null)
			}
		} catch (err) {
			setError('Failed to delete agent')
			console.error('Error deleting agent:', err)
		}
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
											className='border rounded-lg p-4 bg-gray-50'
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
														<p className='text-sm text-gray-600 mt-1'>
															{agent.description}
														</p>
													)}
													<p className='text-xs text-gray-400 mt-2'>
														Created:{' '}
														{new Date(agent.createdAt).toLocaleDateString()}
													</p>
												</div>
												<button
													onClick={() => handleDeleteAgent(agent.id)}
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
								<form onSubmit={handleAskQuestion} className='mb-6'>
									<div className='mb-4'>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Ask a question about hotel services
										</label>
										<textarea
											value={question}
											onChange={(e) => setQuestion(e.target.value)}
											className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
											placeholder='What are your check-in times? Do you have room service? etc.'
											rows={3}
											required
										/>
									</div>
									<button
										type='submit'
										disabled={askingQuestion}
										className='w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed'
									>
										{askingQuestion ? 'Asking...' : 'Ask Hotel Bot'}
									</button>
								</form>

								{botResponse && (
									<div className='bg-green-50 border border-green-200 rounded-lg p-4'>
										<h4 className='font-medium text-green-800 mb-2'>
											Hotel Bot Response:
										</h4>
										<p className='text-green-700'>{botResponse}</p>
									</div>
								)}

								<div className='mt-6 text-sm text-gray-600'>
									<h4 className='font-medium mb-2'>Try asking about:</h4>
									<ul className='list-disc list-inside space-y-1'>
										<li>Check-in and check-out times</li>
										<li>Hotel amenities and services</li>
										<li>Room service availability</li>
										<li>Parking and WiFi information</li>
										<li>Cancellation policies</li>
									</ul>
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
			</div>
		</div>
	)
}
