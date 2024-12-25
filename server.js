require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

// Set up MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,        // From .env file
  user: process.env.DB_USER,        // From .env file
  password: process.env.DB_PASSWORD, // From .env file
  database: process.env.DB_NAME,     // From .env file
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up session middleware before using flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',  // Use your session secret here
  resave: false,
  saveUninitialized: true
}));

// Set up flash messages
app.use(flash());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Flash message middleware
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Show login page (GET request)
app.get('/login', (req, res) => {
  res.render('user/login', { title: 'Login' });
});

// Handle login form submission (POST request)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query database for user by email
  const query = 'SELECT * FROM customers WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      req.flash('error', 'Error during login');
      return res.redirect('/login');
    }

    if (results.length === 0) {
      req.flash('error', 'User not found');
      return res.redirect('/login');
    }

    // Compare hashed password with the entered password
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        req.flash('error', 'An error occurred during login');
        return res.redirect('/login');
      }

      if (isMatch) {
        req.flash('success', 'Login successful!');
        return res.redirect('/'); // Redirect to home page after login
      } else {
        req.flash('error', 'Incorrect password');
        return res.redirect('/login');
      }
    });
  });
});

// Show registration page (GET request)
app.get('/register', (req, res) => {
  res.render('user/register', { title: 'Register' });
});

// Handle registration form submission (POST request)
app.post('/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Simple validation
  if (!username || !email || !password || !confirmPassword) {
    req.flash('error', 'All fields are required');
    return res.redirect('/register');
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/register');
  }

  // Check if email already exists
  const checkEmailQuery = 'SELECT * FROM customers WHERE email = ?';
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err); // Detailed logging
      req.flash('error', 'Error checking email');
      return res.redirect('/register');
    }

    if (results.length > 0) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    // Log the data before proceeding with insertion
    console.log('Registering user with:', { username, email });

    // Hash the password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err); // Detailed logging
        req.flash('error', 'Error hashing password');
        return res.redirect('/register');
      }

      // Save the user to the MySQL database
      const insertQuery = 'INSERT INTO customers (username, email, password) VALUES (?, ?, ?)';
      connection.query(insertQuery, [username, email, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error saving user to database:', err); // Detailed logging
          req.flash('error', 'Error saving user to database');
          return res.redirect('/register');
        }

        req.flash('success', 'Registration successful!');
        res.redirect('/login'); // Redirect to login page after successful registration
      });
    });
  });
});

// Home page (GET request)
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
