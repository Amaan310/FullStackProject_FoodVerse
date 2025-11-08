/* eslint-disable no-unused-vars */
import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import {
  FaCoffee,
  FaIceCream,
  FaPizzaSlice,
  FaUtensils,
  FaFish,
  FaLeaf,
  FaDrumstickBite,
  FaHamburger,
  FaCarrot,
  FaCookieBite,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const categories = useLoaderData() || [];

  // Category icon mapping
  const getCategoryIcon = (category) => {
    const icons = {
      "Non-Vegetarian": (
        <span className="flex items-center justify-center translate-y-[2px] scale-90">
          <FaDrumstickBite />
        </span>
      ),
      Vegetarian: <FaLeaf />,
      Vegan: <FaCarrot />,
      Beverage: <FaCoffee />,
      Dessert: <FaIceCream />,
      "Ice Cream": <FaIceCream />,
      "Main Course": <FaUtensils />,
      Snack: <FaCookieBite />,
      "Indo-Chinese": <FaHamburger />,
      Italian: <FaPizzaSlice />,
      Seafood: <FaFish />,
      Punjabi: <FaUtensils />,
      "South Indian": <FaUtensils />,
      "North Indian": <FaUtensils />,
      "East Indian": <FaUtensils />,
      "West Indian": <FaUtensils />,
      default: <FaUtensils />,
    };
    return icons[category] || icons.default;
  };

  // 🎯 Logical sorting order (user-focused)
  const dietary = ["Vegetarian", "Non-Vegetarian", "Vegan"];
  const mealTypes = [
    "Main Course",
    "Snack",
    "Dessert",
    "Ice Cream",
    "Beverage",
    "Seafood",
  ];
  const regional = [
    "North Indian",
    "South Indian",
    "Punjabi",
    "Indo-Chinese",
    "Italian",
    "East Indian",
    "West Indian",
    "Spicy",
  ];

  // Sort dynamically according to the order above
  const sortOrder = [...dietary, ...mealTypes, ...regional];
  const sortedCategories = categories.sort((a, b) => {
    const aIndex = sortOrder.indexOf(a);
    const bIndex = sortOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/images/food_pattern_light.png')] opacity-5 bg-repeat bg-center pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12 sm:mb-14">
          <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">
            Explore Recipes
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Browse by Category
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
            Find your next favorite meal by exploring our diverse recipe
            categories — from dietary preferences to global cuisines.
          </p>
        </div>

        {/* Categories Grid */}
        {sortedCategories.length > 0 ? (
          <motion.div
            className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {sortedCategories.map((category) => (
              <motion.div
                key={category}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  transition: { type: "spring", stiffness: 220 },
                }}
                className="flex"
              >
                <Link
                  to={`/recipes?category=${encodeURIComponent(category)}`}
                  className="group flex flex-col items-center justify-center text-center p-8 sm:p-10 w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_8px_20px_rgba(255,0,0,0.1)] hover:border-red-200 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                  {/* Icon + Text */}
                  <div className="relative z-10 flex flex-col items-center justify-between h-full">
                    <div className="text-red-600 group-hover:text-white text-4xl sm:text-5xl mb-4 transition-colors duration-300 flex items-center justify-center">
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">
                      {category}
                    </h3>
                    <p className="mt-2 text-gray-500 group-hover:text-gray-100 transition-colors duration-300 text-sm sm:text-base">
                      View all recipes in the "{category}" category.
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="mt-12 text-center text-gray-500 text-lg">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
}
