const express = require('express');
const router = express.Router();

const { userSignup } = require('../controller/usersignup');
const { userLogin } = require('../controller/userlogin');
const { userProfile, getFavorites, addFavorite, removeFavorite } = require('../controller/userprofile');
const verifyToken = require('../middleware/auth');

// --- User Authentication ---
router.post('/signup', userSignup);
router.post('/login', userLogin);

// --- User Profile & Favorites ---
router.get('/profile/:id', verifyToken, userProfile);
router.get('/favorites', verifyToken, getFavorites);
router.post('/favorites/add', verifyToken, addFavorite);
router.post('/favorites/remove', verifyToken, removeFavorite);

module.exports = router;
