require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/dbcon');

const app = express();
const PORT = process.env.PORT || 10000;

// 🔗 Connect MongoDB
dbConnect();

// ✅ CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://foodverse07.netlify.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(express.static('public'));

// ✅ Import Routes
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');

// ✅ Mount Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('<h1>🍽️ FoodVerse Backend is Running Successfully!</h1>');
});

// ✅ Handle Invalid Routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
