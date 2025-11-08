// src/components/RecipeFormLayout.jsx
import React from "react";

export default function RecipeFormLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg shadow-gray-200 p-6 sm:p-8 mt-4 sm:mt-6 transition-all duration-300 hover:shadow-xl">
        {title && (
          <div className="text-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-bold text-gray-800 drop-shadow-sm">
              {title}
            </h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
