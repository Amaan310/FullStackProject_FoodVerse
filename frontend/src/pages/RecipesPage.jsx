/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useLoaderData, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import RecipeItems from '../components/RecipeItems';
import { BsJournalBookmark } from 'react-icons/bs';
import useFavorites from '../hooks/useFavorites';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { MdKeyboardVoice } from 'react-icons/md';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const [isListening, setIsListening] = useState(false);

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Sorry, your browser doesn't support voice recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onspeechend = () => {
            recognition.stop();
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
        };
        
        recognition.onerror = (event) => {
            console.error("Voice recognition error:", event.error);
            setIsListening(false);
        }

        recognition.start();
    };

    return (
        <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative flex items-center">
                <FaSearch className="absolute left-4 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a recipe..."
                    className="w-full pl-12 pr-12 py-3 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                />
                <button
                    onClick={handleVoiceSearch}
                    className={`absolute right-4 p-2 rounded-full transition-colors duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:bg-gray-100'}`}
                    aria-label="Search with voice"
                >
                    <MdKeyboardVoice className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};


const FilterControls = ({ allCategories, selectedCategory, onCategoryChange }) => {
    const filterGroups = {
        'Meal Type': ['Main Course', 'Appetizer', 'Dessert', 'Sweets', 'Snack', 'Breakfast', 'Beverage'],
        'Cuisine': ['North Indian', 'South Indian', 'Punjabi', 'Gujarati', 'Mughlai', 'Bengali', 'Kashmiri', 'Maharashtrian', 'Coastal'],
        'Dietary': ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Healthy'],
        'Style': ['Curry', 'Street Food', 'Lentils', 'Rice Dish', 'Steamed', 'Pudding']
    };

    const handleSelectChange = (e) => {
        onCategoryChange(e.target.value);
    };

    return (
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(filterGroups).map(([groupName, categories]) => {
                    const isGroupSelected = categories.includes(selectedCategory);
                    return (
                        <div key={groupName}>
                            <label htmlFor={groupName} className="block text-sm font-medium text-gray-700 mb-1">{groupName}</label>
                            <select
                                id={groupName}
                                name={groupName}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                onChange={handleSelectChange}
                                value={isGroupSelected ? selectedCategory : 'All'}
                            >
                                <option value="All">All {groupName.toLowerCase()}</option>
                                {categories.map(cat => (
                                    allCategories.includes(cat) && <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    );
                })}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">.</label>
                    <button
                        onClick={() => onCategoryChange('All')}
                        className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                        Reset All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function RecipesPage() {
    const loaderData = useLoaderData();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [recipes, setRecipes] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    const INITIAL_LOAD_COUNT = 6;
    const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
    const [searchQuery, setSearchQuery] = useState('');

    const { isFavorite, toggleFavorite, favorites } = useFavorites();

    const isMyRecipesPage = location.pathname === '/myRecipe';
    const isFavRecipesPage = location.pathname === '/favrecipes';
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
                recipesToShow = allLoadedRecipes.filter(item => String(item.createdBy?._id) === String(user._id));
            }
        } else if (isFavRecipesPage) {
            recipesToShow = favorites;
        }
        setRecipes(recipesToShow);
    }, [loaderData, location.pathname, favorites]); 
    
    const handleDelete = async (recipeId) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) {
            return;
        }
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;

            if (!token) {
                console.error("Authentication token not found.");
                return;
            }
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete the recipe.');
            }
            
            setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe._id !== recipeId));

        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Could not delete the recipe. Please try again.");
        }
    };

    const selectedCategory = searchParams.get('category') || 'All';
    
    useEffect(() => {
        setVisibleCount(INITIAL_LOAD_COUNT);
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        setSearchQuery('');
        if (category === 'All') {
            navigate('/recipes');
        } else {
            navigate(`/recipes?category=${encodeURIComponent(category)}`);
        }
    };
    
    const filteredRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const visibleRecipes = filteredRecipes.slice(0, visibleCount);
    
    let pageTitle = 'Explore All Recipes';
    let pageSubtitle = 'Discover delicious recipes from around the world.';
    let emptyMessage = 'No recipes found.';
    if (searchQuery) {
        emptyMessage = `No recipes found for "${searchQuery}"`;
    }

    if (isMyRecipesPage) {
        pageTitle = 'My Created Recipes';
        pageSubtitle = 'Here you can manage, edit, or delete the recipes you have shared.';
        emptyMessage = "You haven't created any recipes yet.";
    } else if (isFavRecipesPage) {
        pageTitle = 'My Favorite Recipes';
        pageSubtitle = 'The recipes you love, all in one place.';
        emptyMessage = "You haven't added any recipes to your favorites yet.";
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
        exit: { opacity: 0, transition: { duration: 0.3 } } 
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-sm font-bold text-red-600 uppercase tracking-wider">{isExplorePage ? 'Delicious Recipes' : ''}</p>
                    <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{pageTitle}</h1>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{pageSubtitle}</p>
                </div>
                
                {isExplorePage && (
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                )}
                
                {isExplorePage && allCategories.length > 0 && (
                    <FilterControls
                        allCategories={allCategories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                )}
                {filteredRecipes.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            <AnimatePresence>
                                {visibleRecipes.map((recipe) => (
                                    <motion.div 
                                        key={recipe._id} 
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
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

                        {visibleCount < filteredRecipes.length && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => setVisibleCount(prevCount => prevCount + INITIAL_LOAD_COUNT)}
                                    className="px-8 py-3 text-lg font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg"
                                >
                                    Show More
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <BsJournalBookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">{emptyMessage}</h3>
                    </div>
                )}
            </div>
        </div>
    );
}