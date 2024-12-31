require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

// Import routes
const productRoutes = require('./routes/productRoutes');
const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes'); // Add user routes

// Middleware
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'fallback_secret', // Use environment variable for session secret
    saveUninitialized: false, 
    resave: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // Secure cookies only in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    }
}));

// Configure flash middleware
app.use(flash());

// Make flash messages available in all views (with res.locals)
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.user = req.session.user || null;  // Make user object available in all views
    next();
});

// Set view engine
app.set('view engine', 'ejs');

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads'));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(express.json()); // For JSON requests

// Routes
app.use('/product', productRoutes);  // Product routes
app.use('/', indexRoutes);            // Index routes
app.use('/user', userRoutes);         // User routes (for login, register, etc.)

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
