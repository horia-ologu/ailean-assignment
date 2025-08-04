import { Agent } from '../services/api'

interface DeleteConfirmationModalProps {
	agent: Agent
	onClose: () => void
	onConfirm: () => void
}

export default function DeleteConfirmationModal({
	agent,
	onClose,
	onConfirm,
}: DeleteConfirmationModalProps) {
	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
				{/* Modal Header */}
				<div className='flex justify-between items-center p-6 border-b'>
					<h2 className='text-xl font-semibold text-red-600'>
						Confirm Deletion
					</h2>
					<button
						onClick={onClose}
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
								Delete Agent &ldquo;{agent.name}&rdquo;
							</h3>
							<div className='flex gap-2 mb-3'>
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
							<p className='text-sm text-gray-600 mb-4'>
								Are you sure you want to delete this agent? This action cannot
								be undone.
							</p>
							{agent.description && (
								<div className='bg-gray-50 p-3 rounded border'>
									<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
										Agent Description
									</p>
									<p className='text-sm text-gray-700'>{agent.description}</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Modal Footer */}
				<div className='flex justify-end space-x-3 p-6 border-t bg-gray-50'>
					<button
						onClick={onClose}
						className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors'
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium transition-colors'
					>
						Delete Agent
					</button>
				</div>
			</div>
		</div>
	)
}
