const https = require('http');

// Test POST /api/thread
const postData = JSON.stringify({
	participants: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
});

const options1 = {
	hostname: 'localhost',
	port: 8000,
	path: '/api/thread',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(postData),
	},
};

console.log('Testing POST /api/thread...');
const req1 = https.request(options1, (res) => {
	console.log(`Status: ${res.statusCode}`);
	console.log(`Headers: ${JSON.stringify(res.headers)}`);
	res.setEncoding('utf8');
	res.on('data', (chunk) => {
		console.log(`Body: ${chunk}`);
	});
	res.on('end', () => {
		console.log('Thread test completed\n');

		// Test POST /api/message
		const messageData = JSON.stringify({
			threadId: '507f1f77bcf86cd799439011',
			from: '507f1f77bcf86cd799439011',
			to: ['507f1f77bcf86cd799439012'],
			text: 'Hello, this is a test message!',
		});

		const options2 = {
			hostname: 'localhost',
			port: 8000,
			path: '/api/message',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(messageData),
			},
		};

		console.log('Testing POST /api/message...');
		const req2 = https.request(options2, (res) => {
			console.log(`Status: ${res.statusCode}`);
			console.log(`Headers: ${JSON.stringify(res.headers)}`);
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				console.log(`Body: ${chunk}`);
			});
			res.on('end', () => {
				console.log('Message test completed');
			});
		});

		req2.on('error', (e) => {
			console.error(`Problem with message request: ${e.message}`);
		});

		req2.write(messageData);
		req2.end();
	});
});

req1.on('error', (e) => {
	console.error(`Problem with thread request: ${e.message}`);
});

req1.write(postData);
req1.end();
