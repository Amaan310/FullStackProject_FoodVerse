/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import RecipeFormLayout from "../components/RecipeFormLayout"; // ✅ shared layout

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [time, setTime] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState(""); // ✅ NEW
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ helper to normalize YouTube URL
  const normalizeYoutubeUrl = (url) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://www.youtube.com/watch?v=${trimmed}`;
  };

  // ✅ Fetch recipe details on mount
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const res = await api.get(`/api/users/getrecipe/${id}`);
        const data = res.data.data;

        setTitle(data.title || "");
        setCategory(Array.isArray(data.category) ? data.category.join(", ") : "");
        setIngredients(Array.isArray(data.ingredients) ? data.ingredients.join(", ") : "");
        setInstructions(data.instructions || "");
        setTime(data.time || "");
        setExistingImage(data.coverImage || "");

        // ✅ load youtubeUrl if already present in DB
        setYoutubeUrl(data.youtubeUrl || "");
      } catch (error) {
        setError("Failed to load recipe data.");
      }
    };
    fetchRecipeData();
  }, [id]);

  // ✅ Handle new image selection or capture
  const handleImageChange = (file) => {
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file)); // instant preview
    }
  };

  // ✅ Handle update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("time", time);
      formData.append("instructions", instructions);
      formData.append("ingredients", ingredients);

      // ✅ always send something (empty string is fine)
      formData.append("youtubeUrl", normalizeYoutubeUrl(youtubeUrl));

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await api.put(`/api/users/updaterecipe/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/myRecipe");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update recipe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecipeFormLayout title="Edit Your Recipe">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-gray-500 text-xs">(comma separated)</span>
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            required
          />
        </div>

        {/* Cooking Time */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Cooking Time (in minutes)
          </label>
          <input
            id="time"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            required
          />
        </div>

        {/* ✅ YouTube Link (optional) */}
        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Tutorial Link <span className="text-gray-500 text-xs">(optional)</span>
          </label>
          <input
            id="youtubeUrl"
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            placeholder="Paste YouTube URL or video ID"
          />
          <p className="mt-1 text-xs text-gray-500">
            If you leave this empty, no YouTube button will appear on the recipe page.
          </p>
        </div>

        {/* Ingredients */}
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients <span className="text-gray-500 text-xs">(comma separated)</span>
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            required
          />
        </div>

        {/* Instructions */}
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
            Instructions <span className="text-gray-500 text-xs">(one step per line)</span>
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            required
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>

          {/* Preview section */}
          {(previewImage || existingImage) && (
            <div className="my-3">
              <img
                src={
                  previewImage
                    ? previewImage
                    : `${import.meta.env.VITE_API_URL}/images/${existingImage}`
                }
                alt="Recipe preview"
                className="w-48 h-32 object-cover rounded-lg shadow-md border border-gray-200"
              />
              {previewImage && (
                <p className="text-xs text-gray-500 mt-1">Preview of new image</p>
              )}
            </div>
          )}

          {/* Desktop input (visible only on ≥sm screens) */}
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0])}
            className="hidden sm:block w-full text-sm text-gray-500 mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all"
          />

          {/* Mobile/Tablet buttons (visible only on <sm screens) */}
          <div className="mt-2 flex sm:hidden gap-3">
            {/* Gallery Upload */}
            <label className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-center border border-gray-200 transition">
              📁 Choose from Gallery
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </label>

            {/* Camera Capture */}
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

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md shadow-sm">
            {error}
          </p>
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 transition-all"
          >
            {isLoading ? "Updating..." : "Update Recipe"}
          </button>
        </div>
      </form>
    </RecipeFormLayout>
  );
}
