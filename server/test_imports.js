try {
    require('./config/db');
    console.log('DB config loaded');
    require('./models/User');
    console.log('User model loaded');
    require('./routes/authRoutes');
    console.log('Auth routes loaded');
} catch (e) {
    console.error(e);
}
