const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();  // User is logged in, proceed to the next route
    }
    req.flash('error', 'You must be logged in to access this page');
    res.redirect('/login');  // If not logged in, redirect to login
}

// Register route
router.get('/register', (req, res) => {
    res.render('user/register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/register');
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already in use');
            return res.redirect('/register');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const userId = await User.create({
            username,
            email,
            password: hashedPassword,  // Store hashed password
        });

        req.flash('success', 'User registered successfully');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Registration failed');
        res.redirect('/register');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('user/login');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Compare entered password with stored hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Set user info in session
        req.session.user = user;

        req.flash('success', 'Logged in successfully');
        res.redirect('/dashboard');  // Redirect to dashboard or home
    } catch (err) {
        console.error(err);
        req.flash('error', 'Login failed');
        res.redirect('/login');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard'); // Stay on dashboard if error occurs
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

// Protect the dashboard route
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('user/dashboard', { user: req.session.user });
});

module.exports = router;
