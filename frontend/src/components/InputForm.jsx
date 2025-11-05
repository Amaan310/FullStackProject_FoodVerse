/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import api from '../utils/api';

export default function InputForm({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

            // 4. Save the items correctly
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userToStore));
            
            // --- END OF FIX ---

            window.dispatchEvent(new CustomEvent('auth-change'));
            onLoginSuccess();
            window.location.reload(); 

        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1 className="auth-app-title">Food Recipes</h1>
                <h2 className="auth-title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
                <p className="auth-subtitle">
                    {isSignUp ? "Sign up to start exploring recipes" : "Log in to your account"}
                </p>
            </div>

            <form className="auth-form" onSubmit={handleOnSubmit}>
                {isSignUp && (
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-input"
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-input"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>

                {error && (
                    <div className="error-message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className={`auth-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            {isSignUp ? "Creating Account..." : "Logging in..."}
                        </>
                    ) : (
                        isSignUp ? "Sign Up" : "Login"
                    )}
                </button>

                <div className="auth-switch">
                    <p>
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        <button
                            type="button"
                            className="switch-button"
                            onClick={() => {
                                setIsSignUp(prev => !prev);
                                setError("");
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