export default function Loading() {
	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
			<div className='text-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
				<div className='text-xl text-gray-600'>Loading...</div>
			</div>
		</div>
	)
}
