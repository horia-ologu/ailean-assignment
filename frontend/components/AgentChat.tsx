import { useRef, useEffect } from 'react'
import { Agent } from '../services/api'

interface ChatMessage {
	id: string
	type: 'user' | 'bot'
	message: string
	timestamp: string
}

interface AgentChatProps {
	agents: Agent[]
	selectedAgentId: string | null
	selectedAgentForChat: Agent | null
	isHotelBot: (agent: Agent) => boolean
	onAgentSelection: (agentId: string) => void
	question: string
	setQuestion: (question: string) => void
	chatHistory: ChatMessage[]
	askingQuestion: boolean
	onAskQuestion: (e: React.FormEvent) => void
}

export default function AgentChat({
	agents,
	selectedAgentId,
	selectedAgentForChat,
	isHotelBot,
	onAgentSelection,
	question,
	setQuestion,
	chatHistory,
	askingQuestion,
	onAskQuestion,
}: AgentChatProps) {
	const chatEndRef = useRef<HTMLDivElement>(null)

	// Auto-scroll to bottom when chat history changes
	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [chatHistory, askingQuestion])

	return (
		<div className='bg-white rounded-lg shadow-md p-6'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-6'>Agent Chat</h2>

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
					onChange={(e) => onAgentSelection(e.target.value)}
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
											message.type === 'user' ? 'justify-end' : 'justify-start'
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
					<form onSubmit={onAskQuestion} className='mb-6'>
						<div className='flex space-x-2'>
							<textarea
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								className='flex-1 px-3 py-2 bg-yellow-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none'
								placeholder='Ask about check-in times, amenities, room service...'
								rows={2}
								required
								onKeyPress={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault()
										onAskQuestion(e)
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

					{/* Suggested Questions */}
					<div className='text-sm text-gray-600'>
						<h4 className='font-medium mb-2'>💬 Try asking about:</h4>
						<div className='grid grid-cols-2 gap-2'>
							{isHotelBot(selectedAgentForChat) ? (
								<>
									<button
										onClick={() => setQuestion('What are your check-in times?')}
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
						Please select an agent from the dropdown above to start chatting.
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
	)
}
