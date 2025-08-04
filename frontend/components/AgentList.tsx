import { Agent } from '../services/api'

interface AgentListProps {
	agents: Agent[]
	isHotelBot: (agent: Agent) => boolean
	onAgentClick: (agent: Agent) => void
	onDeleteClick: (agent: Agent) => void
}

export default function AgentList({
	agents,
	isHotelBot,
	onAgentClick,
	onDeleteClick,
}: AgentListProps) {
	if (agents.length === 0) {
		return <p className='text-gray-500'>No agents found.</p>
	}

	return (
		<div className='space-y-3'>
			{agents.map((agent) => (
				<div
					key={agent.id}
					className='border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors'
					onClick={() => onAgentClick(agent)}
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
								Created: {new Date(agent.createdAt).toLocaleDateString()}
							</p>
						</div>
						{!isHotelBot(agent) && (
							<button
								onClick={(e) => {
									e.stopPropagation()
									onDeleteClick(agent)
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
	)
}
