const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

console.log('Loading cors...');
const cors = require('cors');
console.log('Loading db config...');
const { connectDB } = require('./config/db');
console.log('Loading path...');
const path = require('path');

// Load models
console.log('Loading User model...');
require('./models/User');
console.log('Loading Transaction model...');
require('./models/Transaction');

// Connect to database
// Connect to database
console.log('Connecting to DB...');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
});
