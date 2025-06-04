/**
 * Simple load testing script for the backend API using autocannon.
 * Usage:
 *   node loadtest.js [url] [connections] [duration] [token]
 * Example:
 *   node loadtest.js http://localhost:5000/api/barang 10 10 <your-access-token>
 */

import autocannon from 'autocannon';

const url = process.argv[2] || 'http://localhost:5000/api/barang';
const connections = parseInt(process.argv[3], 10) || 5;
const duration = parseInt(process.argv[4], 10) || 10;
const token = process.argv[5]; // Optional: Bearer token

console.log(`🚀 Starting load test on: ${url}`);
console.log(`Connections: ${connections}, Duration: ${duration}s`);

const instance = autocannon({
  url,
  connections,
  duration,
  headers: token ? {
    'Authorization': `Bearer ${token}`
  } : {},
  method: 'GET', // Ganti ke POST/PUT jika perlu
  // body: JSON.stringify({ ... }) // Jika POST/PUT dan butuh body
});

autocannon.track(instance, { renderProgressBar: true });

instance.on('response', (client, statusCode, resBytes, responseTime) => {
  if (statusCode >= 400) {
    console.error(`❌ Error response: ${statusCode}`);
  }
});

instance.on('done', (result) => {
  console.log('✅ Load test finished.');
  console.log(autocannon.printResult(result));
});

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Load test aborted by user.');
  process.exit();
});
