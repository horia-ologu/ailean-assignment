export default function NotFound() {
	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
			<div className='text-center'>
				<h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
				<h2 className='text-2xl font-semibold text-gray-700 mb-4'>
					Page Not Found
				</h2>
				<p className='text-gray-600 mb-8'>
					The page you are looking for does not exist.
				</p>
				<a
					href='/'
					className='bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors'
				>
					Go Back Home
				</a>
			</div>
		</div>
	)
}
