/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import RecipeItems from "../components/RecipeItems";
import { BsJournalBookmark } from "react-icons/bs";
import useFavorites from "../hooks/useFavorites";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaPlus, FaUtensils } from "react-icons/fa";
import { MdKeyboardVoice } from "react-icons/md";

// ------------------ SEARCH BAR ------------------
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="mb-6 sm:mb-8 max-w-2xl mx-auto px-3 sm:px-0">
      <div className="relative flex items-center">
        <FaSearch className="absolute left-4 text-gray-400 text-sm sm:text-base" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a recipe..."
          className="w-full pl-12 pr-12 py-2.5 sm:py-3 text-sm sm:text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
        />
        <button
          onClick={handleVoiceSearch}
          className={`absolute right-4 p-2 rounded-full transition-colors duration-300 ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "text-gray-500 hover:bg-gray-100"
          }`}
          aria-label="Search with voice"
        >
          <MdKeyboardVoice className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

// ------------------ FILTER CONTROLS ------------------
const FilterControls = ({
  allCategories,
  selectedCategory,
  onCategoryChange,
}) => {
  const filterGroups = {
    "Meal Type": [
      "Main Course",
      "Appetizer",
      "Dessert",
      "Sweets",
      "Snack",
      "Breakfast",
      "Beverage",
    ],
    Cuisine: [
      "North Indian",
      "South Indian",
      "Punjabi",
      "Gujarati",
      "Mughlai",
      "Bengali",
      "Kashmiri",
      "Maharashtrian",
      "Coastal",
    ],
    Dietary: ["Vegetarian", "Non-Vegetarian", "Vegan", "Healthy"],
    Style: [
      "Curry",
      "Street Food",
      "Lentils",
      "Rice Dish",
      "Steamed",
      "Pudding",
    ],
  };

  const handleSelectChange = (e) => onCategoryChange(e.target.value);

  return (
    <div className="mb-8 p-3 sm:p-5 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
        {Object.entries(filterGroups).map(([groupName, categories]) => {
          const isGroupSelected = categories.includes(selectedCategory);
          return (
            <div key={groupName} className="flex flex-col">
              <label
                htmlFor={groupName}
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                {groupName}
              </label>
              <select
                id={groupName}
                name={groupName}
                className="block w-full px-2 py-2 sm:text-sm border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md"
                onChange={handleSelectChange}
                value={isGroupSelected ? selectedCategory : "All"}
              >
                <option value="All">All {groupName.toLowerCase()}</option>
                {categories.map(
                  (cat) =>
                    allCategories.includes(cat) && (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                )}
              </select>
            </div>
          );
        })}
        <div className="flex flex-col justify-end">
          <button
            onClick={() => onCategoryChange("All")}
            className="w-full px-3 py-2 text-sm sm:text-base border border-transparent rounded-md font-medium text-white bg-red-600 hover:bg-red-700 transition-all"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------ MAIN PAGE ------------------
export default function RecipesPage() {
  const loaderData = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const INITIAL_LOAD_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const [searchQuery, setSearchQuery] = useState("");

  const { isFavorite, toggleFavorite, favorites } = useFavorites();

  const isMyRecipesPage = location.pathname === "/myRecipe";
  const isFavRecipesPage = location.pathname === "/favrecipes";
  const isExplorePage = !isMyRecipesPage && !isFavRecipesPage;

  useEffect(() => {
    let recipesToShow = [];
    if (isExplorePage) {
      recipesToShow = loaderData?.recipes || [];
      setAllCategories(loaderData?.categories || []);
    } else if (isMyRecipesPage) {
      const allLoadedRecipes = loaderData?.recipes || [];
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user._id) {
        recipesToShow = allLoadedRecipes.filter(
          (item) => String(item.createdBy?._id) === String(user._id)
        );
      }
    } else if (isFavRecipesPage) {
      recipesToShow = favorites;
    }
    setRecipes(recipesToShow);
  }, [loaderData, location.pathname, favorites]);

  const handleDelete = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to delete recipes.");
        navigate("/");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/deleterecipe/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete the recipe.");
      }

      setRecipes((currentRecipes) =>
        currentRecipes.filter((recipe) => recipe._id !== recipeId)
      );
      alert("Recipe deleted successfully!");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert(error.message || "Could not delete the recipe. Please try again.");
    }
  };

  const selectedCategory = searchParams.get("category") || "All";
  useEffect(() => setVisibleCount(INITIAL_LOAD_COUNT), [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSearchQuery("");
    category === "All"
      ? navigate("/recipes")
      : navigate(`/recipes?category=${encodeURIComponent(category)}`);
  };

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const visibleRecipes = filteredRecipes.slice(0, visibleCount);

  let pageTitle = "Explore All Recipes";
  let pageSubtitle = "Discover delicious recipes from around the world.";
  let emptyMessage = searchQuery
    ? `No recipes found for "${searchQuery}"`
    : "No recipes found.";
  if (isMyRecipesPage) {
    pageTitle = "My Created Recipes";
    pageSubtitle =
      "Here you can manage, edit, or delete the recipes you have shared.";
    emptyMessage = "You haven't created any recipes yet.";
  } else if (isFavRecipesPage) {
    pageTitle = "My Favorite Recipes";
    pageSubtitle = "The recipes you love, all in one place.";
    emptyMessage = "You haven't added any recipes to your favorites yet.";
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-10 px-3 sm:px-6 lg:px-8 overflow-x-hidden relative">
      {/* Decorative Background */}
      {isMyRecipesPage && (
        <div className="absolute inset-0 bg-[url('/images/food_pattern_light.png')] opacity-5 bg-repeat bg-center pointer-events-none"></div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-10 px-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            {pageTitle}
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </div>

        {/* Search & Filters */}
        {isExplorePage && (
          <>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            {allCategories.length > 0 && (
              <FilterControls
                allCategories={allCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            )}
          </>
        )}

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              <AnimatePresence>
                {visibleRecipes.map((recipe) => (
                  <motion.div
                    key={recipe._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="w-full sm:w-[95%] md:w-[90%] lg:w-full"
                  >
                    <RecipeItems
                      item={recipe}
                      isFavorite={isFavorite(recipe._id)}
                      onFavToggle={toggleFavorite}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Floating Add (+) Button */}
            {isMyRecipesPage && (
              <div className="fixed bottom-7 right-7 sm:bottom-9 sm:right-9 z-50 group">
                <span className="absolute -top-10 right-1/2 translate-x-1/2 text-sm bg-gray-800 text-white px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shadow-md whitespace-nowrap">
                  Add Recipe
                </span>
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/addrecipes")}
                  className="bg-red-500 hover:bg-red-600 text-white text-xl sm:text-2xl p-3 sm:p-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <FaPlus />
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center py-16 sm:py-13 mt-[-20px] sm:mt-[-30px]">
            <motion.div
              className="text-center py-12 sm:py-16 px-6 bg-white rounded-2xl shadow-md max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isMyRecipesPage ? (
                <>
                  <motion.img
                    src="/images/no-recipes.png"
                    alt="No recipes yet"
                    className="mx-auto w-28 sm:w-36 md:w-44 lg:w-48 opacity-95 drop-shadow-md"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <h3 className="mt-6 text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                    You haven’t shared any recipes yet!
                  </h3>
                  <p className="mt-2 text-gray-500 text-sm sm:text-base md:text-lg max-w-md mx-auto">
                    Start sharing your delicious creations with the{" "}
                    <span className="text-red-500 font-medium">FoodVerse</span>{" "}
                    community.
                  </p>
                  <motion.button
                    onClick={() => navigate("/addrecipes")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base shadow-md transition-all duration-200"
                  >
                    <span className="text-lg">
                      <FaUtensils />
                    </span>{" "}
                    Add Yours Now!
                  </motion.button>
                </>
              ) : (
                <>
                  <BsJournalBookmark className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base sm:text-xl font-semibold text-gray-700">
                    {emptyMessage}
                  </h3>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
