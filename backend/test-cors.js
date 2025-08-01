#!/usr/bin/env node

/**
 * CORS Test Script
 *
 * This script tests the CORS configuration of the backend API
 * to ensure it properly blocks unauthorized origins while allowing
 * legitimate requests.
 */

const http = require('http')

const API_BASE = 'http://localhost:3001'

// Test cases
const tests = [
	{
		name: 'Legitimate origin (localhost:3000)',
		origin: 'http://localhost:3000',
		expectedBlocked: false,
	},
	{
		name: 'Malicious origin',
		origin: 'http://malicious-site.com',
		expectedBlocked: true,
	},
	{
		name: 'Another unauthorized origin',
		origin: 'http://evil-site.com',
		expectedBlocked: true,
	},
	{
		name: 'No origin header (mobile/API clients)',
		origin: null,
		expectedBlocked: false,
	},
]

function makeRequest(origin, path = '/api/health') {
	return new Promise((resolve) => {
		const options = {
			hostname: 'localhost',
			port: 3001,
			path: path,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}

		if (origin) {
			options.headers['Origin'] = origin
		}

		const req = http.request(options, (res) => {
			let data = ''
			res.on('data', (chunk) => {
				data += chunk
			})
			res.on('end', () => {
				resolve({
					statusCode: res.statusCode,
					headers: res.headers,
					data: data,
					blocked: res.statusCode >= 400,
				})
			})
		})

		req.on('error', (err) => {
			resolve({
				statusCode: 0,
				headers: {},
				data: '',
				blocked: true,
				error: err.message,
			})
		})

		req.end()
	})
}

async function runTests() {
	console.log('🧪 Running CORS Tests...\n')

	let passed = 0
	let failed = 0

	for (const test of tests) {
		console.log(`Testing: ${test.name}`)
		console.log(`Origin: ${test.origin || 'None'}`)

		try {
			const result = await makeRequest(test.origin)

			const corsHeader = result.headers['access-control-allow-origin']
			const actuallyBlocked = result.blocked

			console.log(`Status: ${result.statusCode}`)
			console.log(`CORS Header: ${corsHeader || 'None'}`)
			console.log(`Blocked: ${actuallyBlocked}`)
			console.log(`Expected Blocked: ${test.expectedBlocked}`)

			// For browser CORS, we check the header, not the status code
			let testPassed = false

			if (test.expectedBlocked) {
				// Should be blocked: should get 403 status
				testPassed = result.statusCode === 403
			} else {
				// Should be allowed: should have proper CORS header and success status
				testPassed =
					result.statusCode === 200 &&
					(corsHeader === 'http://localhost:3000' || !test.origin)
			}

			if (testPassed) {
				console.log('✅ PASSED\n')
				passed++
			} else {
				console.log('❌ FAILED\n')
				failed++
			}
		} catch (error) {
			console.log(`❌ ERROR: ${error.message}\n`)
			failed++
		}
	}

	console.log(`\n📊 Test Results:`)
	console.log(`✅ Passed: ${passed}`)
	console.log(`❌ Failed: ${failed}`)
	console.log(`📈 Total: ${passed + failed}`)

	if (failed === 0) {
		console.log('\n🎉 All CORS tests passed! The API is properly secured.')
	} else {
		console.log('\n⚠️  Some CORS tests failed. Please check the configuration.')
		process.exit(1)
	}
}

// Check if server is running
makeRequest(null)
	.then((result) => {
		if (result.statusCode === 200) {
			runTests()
		} else {
			console.log('❌ Server is not running on localhost:3001')
			console.log('Please start the backend server first with: npm run dev')
			process.exit(1)
		}
	})
	.catch((error) => {
		console.log('❌ Failed to connect to server:', error.message)
		console.log('Please start the backend server first with: npm run dev')
		process.exit(1)
	})
