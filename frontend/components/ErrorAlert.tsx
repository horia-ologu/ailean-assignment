interface ErrorAlertProps {
	error: string
	onClose: () => void
}

export default function ErrorAlert({ error, onClose }: ErrorAlertProps) {
	return (
		<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
			{error}
			<button
				onClick={onClose}
				className='float-right text-red-500 hover:text-red-700'
			>
				×
			</button>
		</div>
	)
}
