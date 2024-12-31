const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // Import the user model
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Render login page
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('user/login', { title: 'Login' });
});

// Handle login form submission
router.post('/login', checkNotAuthenticated, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error', 'Email and password are required');
        return res.redirect('/user/login');
    }

    try {
        const user = await User.findByEmail(email); // Find user by email
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = { id: user.id, username: user.username, email: user.email }; // Store user in session
            res.redirect('/user/profile'); // Redirect to profile after login
        } else {
            req.flash('error', 'Invalid email or password');
            res.redirect('/user/login');
        }
    } catch (error) {
        console.error('Login Error:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/user/login');
    }
});

// Render register page
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('user/register', { title: 'Register' });
});

// Handle register form submission
router.post(
    '/register',
    checkNotAuthenticated,
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('A valid email is required'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            req.flash('error', errorMessages);
            return res.redirect('/user/register');
        }

        const { username, email, password } = req.body;

        try {
            // Check if email or username already exists
            const existingEmail = await User.findByEmail(email);
            const existingUsername = await User.findByUsername(username);

            if (existingEmail) {
                req.flash('error', 'Email already exists');
                return res.redirect('/user/register');
            }
            if (existingUsername) {
                req.flash('error', 'Username already exists');
                return res.redirect('/user/register');
            }

            // Hash the password and create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ username, email, password: hashedPassword });

            // Automatically log in the user after successful registration
            req.session.user = { id: newUser.id, username: newUser.username, email: newUser.email };
            res.redirect('/user/profile');
        } catch (error) {
            console.error('Registration Error:', error);
            req.flash('error', 'Error creating user. Please try again.');
            res.redirect('/user/register');
        }
    }
);

// Render user profile page
router.get('/profile', checkAuthenticated, (req, res) => {
    res.render('user/profile', { title: 'User Profile', user: req.session.user });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout Error:', err);
            return res.redirect('/user/profile');
        }
        res.clearCookie('connect.sid');
        res.redirect('/'); // Redirect to home after logout
    });
});

module.exports = router;
