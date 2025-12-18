import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Modal from "./Model";
import InputForm from "./InputForm";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setLogin(!!token);
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  useEffect(() => {
    const openModal = () => setIsOpen(true);
    window.addEventListener("open-login-modal", openModal);
    return () => window.removeEventListener("open-login-modal", openModal);
  }, []);

  const updateLoginStatus = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setLogin(!!token);
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  const closeLogin = () => setIsOpen(false);

  const handleAuthClick = () => {
    if (isLogin) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLogin(false);
      setUser(null);
      navigate("/");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-red-600/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14 md:h-16 pt-[env(safe-area-inset-top)]">

          {/* LOGO */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" className="flex items-center">
              <img src="/images/foodverse_logo.png" alt="FoodVerse Logo" className="h-14 w-auto" />
            </NavLink>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-8">

            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-white transition-colors duration-200 ${
                  isActive ? "text-white font-semibold" : "text-red-100"
                }`
              }
            >
              Home
            </NavLink>

            {/* Auth-only pages */}
            {isLogin && (
              <>
                <NavLink
                  to="/myRecipe"
                  className={({ isActive }) =>
                    `hover:text-white transition-colors duration-200 ${
                      isActive ? "text-white font-semibold" : "text-red-100"
                    }`
                  }
                >
                  My Recipes
                </NavLink>

                <NavLink
                  to="/favrecipes"
                  className={({ isActive }) =>
                    `hover:text-white transition-colors duration-200 ${
                      isActive ? "text-white font-semibold" : "text-red-100"
                    }`
                  }
                >
                  Favorites
                </NavLink>
              </>
            )}

            {/* About (Now last) */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-white transition-colors duration-200 ${
                  isActive ? "text-white font-semibold" : "text-red-100"
                }`
              }
            >
              About
            </NavLink>
          </div>

          {/* RIGHT SIDE – USERNAME + BUTTONS */}
          <div className="flex items-center space-x-4">
            {isLogin && user && (
              <span className="hidden md:inline text-white font-medium text-sm md:text-base">
                Hi, <span className="font-semibold">{user.username}</span>
              </span>
            )}

            <button
              onClick={handleAuthClick}
              className="hidden md:inline bg-white hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm"
            >
              {isLogin ? "Logout" : "Login"}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="block md:hidden text-white">
              {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden fixed left-0 right-0 top-14 bg-white/95 backdrop-blur-lg shadow-xl transform transition-all duration-300 rounded-b-2xl border-t border-gray-200 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-5 pt-5 pb-6 flex flex-col text-gray-800 font-medium space-y-2">

            {isLogin && user && (
              <div className="text-center mb-3 pb-3 border-b border-gray-300 text-base font-semibold text-red-600">
                👋 Hi, {user.username}
              </div>
            )}

            {/* Home */}
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-300"
            >
              Home
            </NavLink>

            {/* Auth-only mobile links */}
            {isLogin && (
              <>
                <NavLink
                  to="/myRecipe"
                  onClick={() => setMenuOpen(false)}
                  className="hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  My Recipes
                </NavLink>

                <NavLink
                  to="/favrecipes"
                  onClick={() => setMenuOpen(false)}
                  className="hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Favorites
                </NavLink>
              </>
            )}

            {/* About (Now last) */}
            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-300"
            >
              About
            </NavLink>

            {/* Login/Logout Mobile */}
            <button
              onClick={() => {
                setMenuOpen(false);
                handleAuthClick();
              }}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-red-700 transition-all duration-300"
            >
              {isLogin ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {isOpen && (
        <Modal onClose={closeLogin}>
          <InputForm setIsOpen={setIsOpen} onLoginSuccess={updateLoginStatus} />
        </Modal>
      )}
    </>
  );
}
