// Import Node's crypto module
const crypto = require('crypto');

// Generate 64 random bytes and convert to a hexadecimal string
const secret = crypto.randomBytes(64).toString('hex');

// Output the generated secret
console.log('Your JWT secret key:', secret);
