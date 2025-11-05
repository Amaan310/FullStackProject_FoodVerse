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
route.get('/getrecipes', getRecipes);
route.get('/getrecipe/:id', getRecipe);
route.post('/createrecipe', upload.single('coverImage'), verifyToken, createRecipe);
route.put('/updaterecipe/:id', updateUpload.single('coverImage'), editRecipe);
route.delete('/deleterecipe/:id', verifyToken, deleteRecipe);
route.get('/categories', getUniqueCategories);

// --- User & Auth Routes ---
route.post('/signup', userSignup);
route.post('/userlogin', userLogin);
route.get('/userprofile/:id', userProfile);

route.get('/favorites', verifyToken, getFavorites);
route.post('/favorites/add', verifyToken, addFavorite);
route.post('/favorites/remove', verifyToken, removeFavorite);
module.exports = route;