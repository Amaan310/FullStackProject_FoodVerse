/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import RecipeItems from "../components/RecipeItems";
import useFavorites from "../hooks/useFavorites";
import { FaSearch, FaPlus, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

export default function Home() {
  const navigate = useNavigate();
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      try {
        const res = await api.get("/api/users/getrecipes");
        const recent = res.data.data.slice(-3).reverse();
        setLatestRecipes(recent);
      } catch (error) {
        console.error("Failed to fetch latest recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestRecipes();
  }, []);

  const heroBackgroundStyle = {
    backgroundImage: 'url("/images/food_background.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const scrollToSection = () => {
    const section = document.getElementById("latest-recipes-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-50">
      {/* 🌟 HERO SECTION */}
      <div
        className="relative overflow-hidden h-screen flex items-center justify-center"
        style={heroBackgroundStyle}
      >
        <div className="absolute inset-0 bg-black/55"></div>

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mx-auto p-8 sm:p-12 rounded-3xl shadow-xl border border-white/20 backdrop-blur-md bg-white/10">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight"
            >
              <span className="block">Cook, Share, and</span>
              <span className="block text-red-400">Discover</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed"
            >
              Join our community of home cooks to find and share your next
              favorite meal. Your ultimate personal cookbook awaits.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 sm:mt-12 flex flex-wrap justify-center items-center gap-5"
            >
              {/* Primary — Explore Recipes */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/recipes")}
                className="px-9 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-semibold rounded-xl
               text-white bg-gradient-to-r from-red-600 to-rose-600
               shadow-[0_4px_12px_rgba(255,0,0,0.2)]
               hover:shadow-[0_6px_16px_rgba(255,0,0,0.20)]
               transition-all duration-150"
              >
                Explore Recipes
              </motion.button>

              {/* Secondary — Share Your Recipe */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/addrecipes")}
                className="px-9 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-semibold rounded-xl
               text-gray-800 bg-gray-100 border border-gray-300
               shadow-sm hover:bg-white hover:border-red-500 hover:text-red-600
               hover:shadow-[0_4px_14px_rgba(255,0,0,0.15)]
               transition-all duration-150"
              >
                Share Your Recipe
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* ↓ Scroll Arrow */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
          onClick={scrollToSection}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <FiChevronDown className="text-white text-4xl sm:text-5xl opacity-80 hover:opacity-100 transition-all duration-300 hover:text-red-400" />
        </motion.div>
      </div>

      {/* 🍽️ LATEST RECIPES */}
      {!isLoading && latestRecipes.length > 0 && (
        <motion.div
          id="latest-recipes-section"
          className="py-20 sm:py-28 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Fresh from the Kitchen
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Discover the latest recipes shared by our amazing community.
              </p>
            </div>

            <motion.div
              className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
            >
              {latestRecipes.map((recipe) => (
                <motion.div
                  key={recipe._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <RecipeItems
                    item={recipe}
                    isFavorite={isFavorite(recipe._id)}
                    onFavToggle={toggleFavorite}
                  />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-12 text-center">
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/recipes")}
                className="px-10 py-3 text-lg font-semibold rounded-lg text-white 
                                bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md"
              >
                View All Recipes
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🧑‍🍳 HOW IT WORKS */}
      <motion.div
        className="bg-gray-50 py-20 sm:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How FoodVerse Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A simple process to your culinary journey.
            </p>
          </div>

          <motion.div
            className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 text-center"
            variants={containerVariants}
          >
            {[
              {
                icon: <FaSearch className="h-8 w-8 text-red-500" />,
                title: "Discover Recipes",
                desc: "Search thousands of community-tested recipes for any occasion.",
              },
              {
                icon: <FaPlus className="h-8 w-8 text-red-500" />,
                title: "Create & Share",
                desc: "Add your own creations and share your culinary passion with the world.",
              },
              {
                icon: <FaHeart className="h-8 w-8 text-red-500" />,
                title: "Save Favorites",
                desc: "Build your personal cookbook by saving the recipes you love.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
