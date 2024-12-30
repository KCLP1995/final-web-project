const User = require('../models/userModel'); // Import the User model

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/register');
        }

        // Check if the user already exists
        const existingUser = await User.findOne(email);
        if (existingUser) {
            req.flash('error', 'Email already in use');
            return res.redirect('/register');
        }

        // Create a new user in the database
        await User.create(username, email, password);

        req.flash('success', 'User registered successfully');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Registration failed');
        res.redirect('/register');
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne(email);
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

        // Set the user in session
        req.session.user = user;
        req.flash('success', 'Logged in successfully');
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Login failed');
        res.redirect('/login');
    }
};

// Get user dashboard
exports.dashboard = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('user/dashboard', { user: req.session.user });
};

// Logout user
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.redirect('/login');
    });
};
