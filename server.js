// frontend/server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const PORT = 3000;

// Load environment variables
dotenv.config();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Render login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.post(`${process.env.BACKEND_URL}/api/users/login`, { username, password });

    if (response.status === 200) {
      req.session.user = { username };
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.render('login', { error: 'An error occurred during login. Please try again.' });
  }
});

// Render main page (only if authenticated)
app.get('/', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${process.env.BACKEND_URL}/api/kitap`);
    const books = response.data;
    res.render('index', { books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
});

// Fetch subtopics for Malumat
app.post('/api/subtopics', async (req, res) => {
  const { book } = req.body;
  try {
    const response = await axios.post(`${process.env.BACKEND_URL}/api/kategori`, { book });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    res.status(500).send('Error fetching subtopics');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on${PORT}`);
});
