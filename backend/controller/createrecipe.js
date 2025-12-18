const Recipe = require('../model/recipe');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + path.parse(file.originalname).name + path.parse(file.originalname).ext;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const createRecipe = async (req, res) => {
    let uploadedFilePath = req.file ? req.file.path : null;

    try {
        // ✅ now also receive youtubeUrl from frontend
        const { title, time, instructions, youtubeUrl } = req.body;

        const category = JSON.parse(req.body.category);
        const ingredients = JSON.parse(req.body.ingredients);

        const coverImage = req.file;

        if (!title || !category || category.length === 0 || !ingredients || ingredients.length === 0 || !instructions || !time) {

            if (uploadedFilePath) {
                fs.unlinkSync(uploadedFilePath);
            }
            return res.status(400).json({ message: "Title, category, ingredients, instructions, and cooking time are required." });
        }

        const parsedTime = typeof time === 'string' && time.includes(' ')
            ? parseInt(time.split(' ')[0], 10)
            : parseInt(time, 10);

        if (isNaN(parsedTime)) {
            if (uploadedFilePath) {
                fs.unlinkSync(uploadedFilePath);
            }
            return res.status(400).json({ message: "Cooking time must be a valid number." });
        }

        const newRecipe = await Recipe.create({
            title,
            category,
            ingredients,
            instructions,
            time: parsedTime,
            coverImage: coverImage ? coverImage.filename : null,
            createdBy: req.user.id,

            // ✅ store YouTube link (optional)
            youtubeUrl: youtubeUrl ? youtubeUrl.trim() : ""
        });

        res.status(201).json({
            success: true,
            data: newRecipe,
            message: "Recipe created successfully",
        });

    } catch (error) {
        if (uploadedFilePath) {
            fs.unlinkSync(uploadedFilePath);
        }
        console.error("Server Error:", error);
        res.status(500).json({
            message: "Server Error: Could not create recipe. Please check logs.",
            error: error.message
        });
    }
};

module.exports = { createRecipe, upload };
