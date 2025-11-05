require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/dbcon');

const app = express();
const PORT = process.env.PORT || 10000;

// Connect to MongoDB
dbConnect();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://foodverse07.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Routes
const apiRoutes = require('./routes/recipe');
app.use('/api', apiRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('✅ FoodVerse Backend Running Successfully!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
