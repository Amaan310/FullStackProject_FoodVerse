require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/dbcon');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Connect to MongoDB
dbConnect();

app.use(cors({
  origin: [
    'http://localhost:5173',        // Vite dev
    'http://127.0.0.1:5173',        // sometimes used
    'https://foodverse07.netlify.app' // live frontend (if used)
  ],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// ✅ API Routes
const apiRoutes = require('./routes/recipe');
app.use('/api', apiRoutes);

// ✅ Default route
app.get('/', (req, res) => {
  res.send('✅ FoodVerse Backend Running Successfully!');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
