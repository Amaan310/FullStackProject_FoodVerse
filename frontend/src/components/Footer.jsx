import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer({ setContactModalOpen }) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-14 px-6 sm:px-8 lg:px-10">
        {/* Grid Layout - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center sm:text-left">
          {/* Brand Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-2xl font-bold text-white mb-3">FoodVerse</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Discover delicious recipes from around the world and share your
              culinary creations with others.
            </p>
          </div>

          {/* Explore Section */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-all duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes"
                  className="hover:text-white transition-all duration-200"
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-white transition-all duration-200"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-all duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-red-500 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setContactModalOpen(true)}
                  className="hover:text-white transition-all duration-200"
                >
                  Contact Us
                </button>
              </li>
              {/* ✅ Removed the duplicate “Terms of Service” here */}
            </ul>
          </div>

          {/* Social Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">
              Follow Us
            </h4>
            <div className="flex justify-center sm:justify-start items-center space-x-6">
              {/* LinkedIn Icon */}
              <a
                href="https://www.linkedin.com/company/food-verse07/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/foodverse07?igsh=czgxdWk4ZTl0bG16"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient
                      id="instaGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} FoodVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
