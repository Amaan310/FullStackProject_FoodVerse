import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import RecipeFormLayout from '../components/RecipeFormLayout'; // ✅ shared layout

export default function AddFoodRecipe() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState(''); // ✅ NEW: optional YouTube link
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle image upload/capture with live preview
  const handleImageChange = (file) => {
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file)); // instant preview
    }
  };

  // ✅ Basic helper to normalize YouTube URL (optional)
  const normalizeYoutubeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    // if user pasted full http/https link, use as-is
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // otherwise, treat as video id
    return `https://www.youtube.com/watch?v=${trimmed}`;
  };

  // ✅ Form submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!coverImage) {
      toast.error('Please upload a recipe image.');
      setError('Please upload a recipe image.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    const ingredientsArray = ingredients
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
    const categoryArray = category
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);

    formData.append('ingredients', JSON.stringify(ingredientsArray));
    formData.append('category', JSON.stringify(categoryArray));
    formData.append('title', title);
    formData.append('time', time);
    formData.append('instructions', instructions);

    // ✅ optional YouTube URL
    if (youtubeUrl.trim()) {
      formData.append('youtubeUrl', normalizeYoutubeUrl(youtubeUrl));
    }

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to add a recipe.');
        setError('You must be logged in to add a recipe.');
        setIsLoading(false);
        return;
      }

      await api.post('/api/users/createrecipe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Recipe added successfully!');
      setTimeout(() => navigate('/myRecipe'), 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || 'Failed to add recipe. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecipeFormLayout title="Add New Recipe">
      <form onSubmit={handleOnSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Recipe Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-gray-500 text-xs">(separate each with a comma)</span>
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="e.g., Main Course, North Indian, Vegetarian"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Cooking Time (in minutes)
          </label>
          <input
            id="time"
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="e.g., 40"
            required
          />
        </div>

        {/* ✅ YouTube Tutorial Link (optional) */}
        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">
            YouTube Tutorial Link <span className="text-gray-500 text-xs">(optional)</span>
          </label>
          <input
            id="youtubeUrl"
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Paste YouTube URL or video ID"
          />
          <p className="mt-1 text-xs text-gray-500">
            Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
          </p>
        </div>

        {/* Ingredients */}
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
            Ingredients <span className="text-gray-500 text-xs">(separate each with a comma)</span>
          </label>
          <textarea
            id="ingredients"
            rows="4"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          ></textarea>
        </div>

        {/* Instructions */}
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
            Instructions <span className="text-gray-500 text-xs">(one step per line)</span>
          </label>
          <textarea
            id="instructions"
            rows="6"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Step 1..."
            required
          ></textarea>
        </div>

        {/* Image Upload with Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Recipe Image</label>

          {/* Image Preview */}
          {previewImage && (
            <div className="my-3">
              <img
                src={previewImage}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg shadow-md border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Preview of selected image</p>
            </div>
          )}

          {/* Desktop Input */}
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0])}
            className="hidden sm:block mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            required
          />

          {/* Mobile/Tablet Buttons */}
          <div className="mt-2 flex sm:hidden gap-3">
            {/* Gallery */}
            <label className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-center border border-gray-200 transition">
              📁 Choose from Gallery
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </label>

            {/* Camera */}
            <label className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-center transition">
              📷 Capture with Camera
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300"
          >
            {isLoading ? 'Adding...' : 'Add Recipe'}
          </button>
        </div>
      </form>
    </RecipeFormLayout>
  );
}
