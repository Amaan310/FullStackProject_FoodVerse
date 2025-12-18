/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputForm({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculateStrength = (pass) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length > 6) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    useEffect(() => {
        setPasswordStrength(calculateStrength(password));
    }, [password]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const endpoint = isSignUp ? "signup" : "userlogin";
        const payload = isSignUp ? { name, email, password } : { email, password };

        try {
            const response = await api.post(`/api/users/${endpoint}`, payload);
            const token = response.data.token;
            const userObject = response.data.user || response.data;
            const { token: removedToken, ...userToStore } = userObject;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userToStore));

            window.dispatchEvent(new CustomEvent('auth-change'));
            onLoginSuccess();
            window.location.reload();

        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength === 0) return "bg-gray-200";
        if (passwordStrength <= 2) return "bg-red-500";
        if (passwordStrength === 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthLabel = () => {
        if (passwordStrength <= 2) return "Weak";
        if (passwordStrength === 3) return "Medium";
        return "Strong";
    };

    return (
        <div className="auth-container p-6">

            {/* 🔥 Removed the “Food Recipes” heading completely */}

            <div className="auth-header text-center mb-6">
                <h2 className="auth-title text-xl font-bold text-gray-800">
                    {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="auth-subtitle text-gray-500 text-sm">
                    {isSignUp ? "Sign up to start exploring recipes" : "Log in to your account"}
                </p>
            </div>

            <form className="auth-form space-y-4" onSubmit={handleOnSubmit}>
                {isSignUp && (
                    <div className="form-group flex flex-col gap-1">
                        <label htmlFor="name" className="form-label font-medium text-gray-700 text-sm">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-input p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                )}

                <div className="form-group flex flex-col gap-1">
                    <label htmlFor="email" className="form-label font-medium text-gray-700 text-sm">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group flex flex-col gap-1">
                    <label htmlFor="password" className="form-label font-medium text-gray-700 text-sm">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="form-input w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all pr-10"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {isSignUp && password && (
                        <div className="mt-2">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs text-gray-500 font-medium">Password strength</span>
                                <span className="text-xs text-gray-500 font-medium">{getStrengthLabel()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${getStrengthColor()}`}
                                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                </div>

                {error && (
                    <div className="error-message bg-red-50 text-red-600 p-3 rounded-lg text-sm border-l-4 border-red-500">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className={`auth-button w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    disabled={isLoading}
                >
                    {isLoading ? (isSignUp ? "Creating Account..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
                </button>

                <div className="auth-switch text-center text-sm text-gray-500 mt-4">
                    <p>
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        <button
                            type="button"
                            className="switch-button ml-1 text-orange-600 font-bold hover:underline"
                            onClick={() => {
                                setIsSignUp(prev => !prev);
                                setError("");
                                setPassword("");
                            }}
                        >
                            {isSignUp ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
