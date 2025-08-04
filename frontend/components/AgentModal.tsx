import { Agent } from '../services/api'

interface AgentModalProps {
	agent: Agent
	isHotelBot: (agent: Agent) => boolean
	onClose: () => void
	onDelete: (agent: Agent) => void
}

export default function AgentModal({
	agent,
	isHotelBot,
	onClose,
	onDelete,
}: AgentModalProps) {
	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
				{/* Modal Header */}
				<div className='flex justify-between items-center p-6 border-b'>
					<h3 className='text-2xl font-semibold text-gray-900'>
						Agent Details
					</h3>
					<button
						onClick={onClose}
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
									{agent.name}
								</p>
								{isHotelBot(agent) && (
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
										agent.type === 'Sales'
											? 'bg-blue-100 text-blue-800'
											: agent.type === 'Support'
											? 'bg-purple-100 text-purple-800'
											: 'bg-orange-100 text-orange-800'
									}`}
								>
									{agent.type}
								</span>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Status
								</label>
								<span
									className={`inline-block px-3 py-2 rounded-full text-sm font-medium ${
										agent.status === 'Active'
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}
								>
									{agent.status}
								</span>
							</div>
						</div>

						{/* Agent ID */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Agent ID
							</label>
							<p className='text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded border'>
								{agent.id}
							</p>
						</div>

						{/* Description */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Description
							</label>
							{agent.description ? (
								<p className='text-gray-700 bg-gray-50 px-4 py-3 rounded border leading-relaxed'>
									{agent.description}
								</p>
							) : (
								<p className='text-gray-500 italic'>No description provided</p>
							)}
						</div>

						{/* Creation Date */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Created At
							</label>
							<div className='text-gray-700'>
								<p className='font-medium'>
									{new Date(agent.createdAt).toLocaleDateString('en-US', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</p>
								<p className='text-sm text-gray-500'>
									{new Date(agent.createdAt).toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
									})}
								</p>
							</div>
						</div>

						{/* Agent Type */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Agent Type
							</label>
							<div className='flex items-center space-x-2'>
								{isHotelBot(agent) ? (
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
						{isHotelBot(agent) && (
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
						onClick={onClose}
						className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
					>
						Close
					</button>
					<button
						onClick={() => {
							onDelete(agent)
							onClose()
						}}
						className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
					>
						Delete Agent
					</button>
				</div>
			</div>
		</div>
	)
}
