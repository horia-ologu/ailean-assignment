#!/usr/bin/env node

/**
 * CORS Test Script - Environment-Aware
 *
 * This script tests the CORS configuration of the backend API
 * in both development and production modes.
 */

const http = require('http')

const API_BASE = 'http://localhost:3001'

// Test cases for development (open CORS)
const devTests = [
	{
		name: 'Authorized origin',
		origin: 'http://localhost:3000',
		expectedBlocked: false,
	},
	{
		name: 'Any origin (allowed in dev)',
		origin: 'http://malicious-site.com',
		expectedBlocked: false,
	},
	{
		name: 'No origin header (allowed in dev)',
		origin: null,
		expectedBlocked: false,
	},
]

// Test cases for production (strict CORS)
const prodTests = [
	{
		name: 'Authorized origin',
		origin: 'http://localhost:3000',
		expectedBlocked: false,
	},
	{
		name: 'Unauthorized origin (blocked in prod)',
		origin: 'http://malicious-site.com',
		expectedBlocked: true,
	},
	{
		name: 'No origin header (blocked in prod)',
		origin: null,
		expectedBlocked: true,
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

async function runTests(tests, environment) {
	console.log(`🧪 Running CORS Tests for ${environment} mode...\n`)

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

			let testPassed = false

			if (test.expectedBlocked) {
				// Should be blocked: should get 403 status
				testPassed = result.statusCode === 403
			} else {
				// Should be allowed: should get 200 status
				testPassed = result.statusCode === 200
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

	console.log(`📊 Test Results for ${environment}:`)
	console.log(`✅ Passed: ${passed}`)
	console.log(`❌ Failed: ${failed}`)
	console.log(`📈 Total: ${passed + failed}\n`)

	return { passed, failed }
}

async function main() {
	// Check if server is running
	try {
		const healthCheck = await makeRequest('http://localhost:3000')
		if (healthCheck.statusCode !== 200) {
			console.log('❌ Server is not running on localhost:3001')
			console.log('Please start the backend server first with: npm run dev')
			process.exit(1)
		}
	} catch (error) {
		console.log('❌ Failed to connect to server:', error.message)
		console.log('Please start the backend server first with: npm run dev')
		process.exit(1)
	}

	// Run development tests (should be current environment)
	const devResults = await runTests(devTests, 'Development')

	console.log(
		'🔄 To test production mode, set NODE_ENV=production and restart the server\n'
	)

	if (devResults.failed === 0) {
		console.log(
			'🎉 All development CORS tests passed! CORS is open for development.'
		)
	} else {
		console.log('⚠️  Some development CORS tests failed.')
		process.exit(1)
	}
}

main()
