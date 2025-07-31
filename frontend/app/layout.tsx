import '../styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Agent Management System',
	description:
		'A system for managing AI agents and interacting with the Hotel Q&A Bot',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	)
}
