/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Outlet, createBrowserRouter, RouterProvider, useNavigate, useLocation, useMatches } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import api from './utils/api';

import MainNavigation from './components/mainNavigations';
import Footer from './components/Footer';
import Model from './components/Model';
import InputForm from './components/InputForm';
import ContactForm from './components/ContactForm';
import ProtectedRoute from './components/ProtectedRoute'; 
import { AuthProvider, useAuth } from './context/AuthContext_temp';

import Home from './pages/home';
import AddFoodRecipe from './pages/AddFoodRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import AboutPage from './pages/AboutPage';
import RecipesPage from './pages/RecipesPage';
import CategoriesPage from './pages/CategoriesPage';

const BASE_API_URL = import.meta.env.VITE_API_URL;

const getAllRecipes = async ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    
    let apiUrl = `${BASE_API_URL}/api/users/getrecipes`;
    if (category) {
        const params = new URLSearchParams({ category: category }).toString();
        apiUrl += `?${params}`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching all recipes (public):", error);
        return [];
    }
};

const getMyRecipes = async () => {
    try {
        const userDataString = localStorage.getItem("user");
        if (!userDataString || userDataString === 'undefined') {
            return []; 
        }

        const user = JSON.parse(userDataString);
        if (!user || !user._id) {
            return []; 
        }

        const allRecipes = await api.get(`/api/users/getrecipes`); 
        
        return allRecipes.data.data.filter(item => 
            String(item.createdBy?._id) === String(user._id)
        ) || [];

    } catch (error) {
        console.error("Error fetching my recipes:", error);
        return [];
    }
};

const getFavRecipes = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];
        const res = await api.get('/api/users/favorites');
        return res.data.favorites || [];

    } catch (error) {
        console.error("Error fetching fav recipes:", error);
        return [];
    }
};

const getRecipe = async ({ params }) => {
    try {
        const res = await api.get(`/api/users/getrecipe/${params.id}`);
        const recipe = res.data.data || res.data;
        
        const recipeWithUsername = { ...recipe, username: recipe.createdBy?.username || 'Anonymous Chef' };
        
        return recipeWithUsername;
    } catch (error) {
        console.error("Error fetching recipe for details page:", error);
        return { 
            title: 'Error Loading Recipe', 
            instructions: 'Could not load recipe details.', 
            ingredients: [], 
            category: [], 
            time: 'N/A', 
            coverImage: null, 
            username: 'Error' 
        };
    }
};

const getCategories = async () => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/users/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching categories (public):", error);
        return [];
    }
};

const getRecipesAndCategories = async (loaderRequest) => {
    const [recipes, categories] = await Promise.all([
        getAllRecipes(loaderRequest),
        getCategories() 
    ]);
    return { recipes, categories };
};

function RootLayout() {
    const [modalOpen, setModalOpen] = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate(); 
    const location = useLocation();
    const matches = useMatches(); 

    useEffect(() => {
        const openModalListener = (event) => {
            if (event.detail === true) {
                setModalOpen(true);
            }
        };
        window.addEventListener('open-login-modal', openModalListener);
        return () => window.removeEventListener('open-login-modal', openModalListener);
    }, []);

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        // Check if the data exists and is NOT the string "undefined"
        if (userDataString && userDataString !== 'undefined') {
            try {
                setUser(JSON.parse(userDataString));
            } catch (error) {
                console.error("Failed to parse user data from localStorage:", error);
                // Clear corrupted data
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLoginSuccess = () => {
        const userDataString = localStorage.getItem('user');
        if (userDataString && userDataString !== 'undefined') {
            try {
                const userData = JSON.parse(userDataString);
                setUser(userData);
            } catch (error) {
                console.error("Failed to parse user data after login:", error);
                setUser(null);
            }
        }
        setModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.dispatchEvent(new CustomEvent('auth-change'));
        setUser(null);
        const protectedPaths = ['/myRecipe', '/favrecipes', '/addrecipes', '/editRecipe'];
        if (protectedPaths.some(path => location.pathname.startsWith(path))) {
            navigate('/', { replace: true }); 
        }
        setModalOpen(false); 
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <MainNavigation user={user} setModalOpen={setModalOpen} handleLogout={handleLogout} />
            <main>
                <Outlet /> 
            </main>
            <Footer setContactModalOpen={setContactModalOpen} />
            
            {modalOpen && (
                <Model onClose={() => setModalOpen(false)}>
                    <InputForm onLoginSuccess={handleLoginSuccess} />
                </Model>
            )}

            {contactModalOpen && (
                <Model onClose={() => setContactModalOpen(false)}>
                    <ContactForm setOpen={setContactModalOpen} />
                </Model>
            )}
        </>
    );
}

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
            children: [
                { index: true, element: <Home /> },
                { path: "/recipes", element: <RecipesPage />, loader: getRecipesAndCategories },
                { path: "/myRecipe", element: <RecipesPage />, loader: getRecipesAndCategories },
                { path: "/favrecipes", element: <RecipesPage />, loader: getFavRecipes },
                
                { 
                    element: <ProtectedRoute />,
                    children: [
                        { path: "/addrecipes", element: <AddFoodRecipe /> },
                        { path: "/editRecipe/:id", element: <EditRecipe /> },
                    ]
                },
                { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe },
                { path: "/about", element: <AboutPage /> }, 
                { path: "/categories", element: <CategoriesPage />, loader: getCategories },
            ]
        }
    ]);

    return <RouterProvider router={router} />;
}