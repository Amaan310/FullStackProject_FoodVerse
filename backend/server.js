require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/dbcon');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔗 Connect MongoDB
dbConnect();

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://foodverse07.netlify.app',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(express.static('public'));

// ✅ Import Routes
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');

// ✅ Use Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('<h1>🍽️ FoodVerse Backend is Running Successfully!</h1>');
});

// ✅ Start Server
app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log(`✅ Server running on port ${PORT}`);
});
