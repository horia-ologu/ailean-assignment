import { useForm } from 'react-hook-form'
import { CreateAgentRequest } from '../services/api'

interface CreateAgentFormProps {
	showCreateForm: boolean
	setShowCreateForm: (show: boolean) => void
	onCreateAgent: (data: CreateAgentRequest) => Promise<void>
	isCreating: boolean
}

export default function CreateAgentForm({
	showCreateForm,
	setShowCreateForm,
	onCreateAgent,
	isCreating,
}: CreateAgentFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CreateAgentRequest>({
		defaultValues: {
			name: '',
			type: 'Sales',
			status: 'Active',
			description: '',
		},
	})

	const onSubmit = async (data: CreateAgentRequest) => {
		try {
			await onCreateAgent(data)
			reset()
			setShowCreateForm(false)
		} catch (error) {
			// Error handling is done in parent component
		}
	}

	return (
		<div className='mb-6'>
			<button
				onClick={() => setShowCreateForm(!showCreateForm)}
				className='w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors'
			>
				<div className='flex items-center'>
					<svg
						className='w-5 h-5 text-blue-600 mr-3'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 6v6m0 0v6m0-6h6m-6 0H6'
						/>
					</svg>
					<span className='text-blue-800 font-medium'>Create New Agent</span>
				</div>
				<svg
					className={`w-5 h-5 text-blue-600 transform transition-transform ${
						showCreateForm ? 'rotate-180' : ''
					}`}
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</button>

			{/* Collapsible Form */}
			{showCreateForm && (
				<div className='mt-4 p-4 border border-gray-200 rounded-lg bg-blue-50'>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Agent Name
							</label>
							<input
								type='text'
								{...register('name', {
									required: 'Agent name is required',
									minLength: {
										value: 2,
										message: 'Agent name must be at least 2 characters',
									},
								})}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.name ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter agent name'
							/>
							{errors.name && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.name.message}
								</p>
							)}
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Agent Type
							</label>
							<select
								{...register('type', { required: 'Agent type is required' })}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.type ? 'border-red-500' : 'border-gray-300'
								}`}
							>
								<option value='Sales'>Sales</option>
								<option value='Support'>Support</option>
								<option value='Marketing'>Marketing</option>
							</select>
							{errors.type && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.type.message}
								</p>
							)}
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Agent Status
							</label>
							<select
								{...register('status', {
									required: 'Agent status is required',
								})}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.status ? 'border-red-500' : 'border-gray-300'
								}`}
							>
								<option value='Active'>Active</option>
								<option value='Inactive'>Inactive</option>
							</select>
							{errors.status && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.status.message}
								</p>
							)}
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Description (optional)
							</label>
							<textarea
								{...register('description')}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='Enter agent description'
								rows={3}
							/>
						</div>
						<div className='flex gap-3'>
							<button
								type='submit'
								disabled={isSubmitting || isCreating}
								className='flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{isSubmitting || isCreating ? 'Creating...' : 'Create Agent'}
							</button>
							<button
								type='button'
								onClick={() => {
									setShowCreateForm(false)
									reset()
								}}
								className='px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50'
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	)
}
