require('dotenv').config();
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

(async () => {
    try {
        console.log('Testing connection...');
        await connectDB();
        console.log('Connection successful.');
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    }
})();
