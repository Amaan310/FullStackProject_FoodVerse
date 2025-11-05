const express = require('express');
const router = express.Router();

const { getRecipes, getRecipe, getUniqueCategories } = require('../controller/getrecipe');
const { createRecipe, upload } = require('../controller/createrecipe');
const { editRecipe, updateUpload } = require('../controller/updaterecipe');
const { deleteRecipe } = require('../controller/deleterecipe');
const verifyToken = require('../middleware/auth');

// --- Recipe CRUD Routes ---
router.get('/', getRecipes); // ✅ GET all recipes => /api/recipes/
router.get('/:id', getRecipe); // ✅ GET single recipe => /api/recipes/:id
router.post('/', upload.single('coverImage'), verifyToken, createRecipe); // ✅ POST new recipe
router.put('/:id', updateUpload.single('coverImage'), verifyToken, editRecipe); // ✅ PUT update recipe
router.delete('/:id', verifyToken, deleteRecipe); // ✅ DELETE recipe
router.get('/categories/all', getUniqueCategories); // ✅ GET all categories

module.exports = router;
