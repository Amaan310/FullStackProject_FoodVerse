const express = require('express');
const route = express.Router();

const { getRecipes, getRecipe, getUniqueCategories } = require('../controller/getrecipe');
const { createRecipe, upload } = require('../controller/createrecipe');
const { editRecipe, updateUpload } = require('../controller/updaterecipe');
const { deleteRecipe } = require('../controller/deleterecipe');
const verifyToken = require('../middleware/auth');

const { userSignup } = require('../controller/usersignup');
const { userLogin } = require('../controller/userlogin');
const { userProfile, getFavorites, addFavorite, removeFavorite } = require('../controller/userprofile');

// --- Recipe Routes ---
route.get('/users/getrecipes', getRecipes);
route.get('/users/getrecipe/:id', getRecipe);
route.post('/users/createrecipe', upload.single('coverImage'), verifyToken, createRecipe);
route.put('/users/updaterecipe/:id', updateUpload.single('coverImage'), verifyToken, editRecipe);
route.delete('/users/deleterecipe/:id', verifyToken, deleteRecipe);
route.get('/users/categories', getUniqueCategories);

// --- User Routes ---
route.post('/users/usersignup', userSignup);
route.post('/users/userlogin', userLogin);
route.get('/users/userprofile/:id', verifyToken, userProfile);

// --- Favorites ---
route.get('/users/favorites', verifyToken, getFavorites);
route.post('/users/favorites/add', verifyToken, addFavorite);
route.post('/users/favorites/remove', verifyToken, removeFavorite);

module.exports = route;
