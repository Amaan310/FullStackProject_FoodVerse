const express = require('express');
const router = express.Router();

const { getRecipes, getRecipe, getUniqueCategories } = require('../controller/getrecipe');
const { createRecipe, upload } = require('../controller/createrecipe');
const { editRecipe, updateUpload } = require('../controller/updaterecipe');
const { deleteRecipe } = require('../controller/deleterecipe');
const verifyToken = require('../middleware/auth');

// --- Recipe CRUD Routes ---
router.get('/', getRecipes);                // ✅ /api/recipes/
router.get('/:id', getRecipe);              // ✅ /api/recipes/:id
router.post('/', upload.single('coverImage'), verifyToken, createRecipe);
router.put('/:id', updateUpload.single('coverImage'), verifyToken, editRecipe);
router.delete('/:id', verifyToken, deleteRecipe);
router.get('/categories/all', getUniqueCategories); // ✅ /api/recipes/categories/all

module.exports = router;
