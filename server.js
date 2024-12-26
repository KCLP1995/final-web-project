// Required dependencies
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Initialize app
const app = express();

// Set up MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Set up routes
const productRoutes = require('./routes/productRoutes');
const indexRoutes = require('./routes/indexRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
app.use('/', purchaseRoutes);

// Set up Multer for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'public/uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
  })
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Flash messages middleware
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Flash message middleware for rendering messages in views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Serve uploaded images
app.use('/uploads', express.static('public/uploads'));

// Routes for product management
app.use('/product', productRoutes);
app.use('/', indexRoutes);

// Product add route
app.get('/add-product', (req, res) => {
  res.render('product/input', { title: 'Add New Product' });
});

app.post('/add-product', upload.single('image'), (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file; // Image file from Multer

  if (!name || !price || !description) {
    req.flash('error', 'All fields are required');
    return res.redirect('/add-product');
  }

  const query = 'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)';
  connection.query(query, [name, price, description, image ? image.filename : null], (err) => {
    if (err) {
      req.flash('error', 'Error saving product');
      return res.redirect('/add-product');
    }
    req.flash('success', 'Product added successfully!');
    res.redirect('/add-product');
  });
});

// User login route
app.get('/login', (req, res) => {
  res.render('user/login', { title: 'Login' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

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

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        req.flash('error', 'An error occurred during login');
        return res.redirect('/login');
      }

      if (isMatch) {
        req.flash('success', 'Login successful!');
        return res.redirect('/'); // Redirect to home page
      } else {
        req.flash('error', 'Incorrect password');
        return res.redirect('/login');
      }
    });
  });
});

// User registration route
app.get('/register', (req, res) => {
  res.render('user/register', { title: 'Register' });
});

app.post('/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    req.flash('error', 'All fields are required');
    return res.redirect('/register');
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/register');
  }

  const checkEmailQuery = 'SELECT * FROM customers WHERE email = ?';
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      req.flash('error', 'Error checking email');
      return res.redirect('/register');
    }

    if (results.length > 0) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        req.flash('error', 'Error hashing password');
        return res.redirect('/register');
      }

      const insertQuery = 'INSERT INTO customers (username, email, password) VALUES (?, ?, ?)';
      connection.query(insertQuery, [username, email, hashedPassword], (err) => {
        if (err) {
          req.flash('error', 'Error saving user');
          return res.redirect('/register');
        }

        req.flash('success', 'Registration successful!');
        res.redirect('/login');
      });
    });
  });
});

// Home page
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
