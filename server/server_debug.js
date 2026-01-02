require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');

console.log('Loading models...');
try {
    const User = require('./models/User');
    console.log('User model loaded');
    const Transaction = require('./models/Transaction');
    console.log('Transaction model loaded');
} catch (error) {
    console.error('Error loading models:', error);
    process.exit(1);
}

console.log('Connecting to DB...');
connectDB().then(() => {
    console.log('DB Connected and Synced');
    process.exit(0);
}).catch(err => {
    console.error('DB Connection failed:', err);
    process.exit(1);
});
