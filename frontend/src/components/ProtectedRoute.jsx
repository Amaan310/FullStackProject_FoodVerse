import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuth(!!localStorage.getItem("token"));
    };

    window.addEventListener("auth-change", handleAuthChange);
    setIsChecking(false);

    return () =>
      window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  useEffect(() => {
    if (!isChecking && !isAuth) {
      // 🔥 Show toast WITHOUT crashing React Router
      setTimeout(() => {
        toast.error("Please log in to access this page.", {
          id: "login-required",
          duration: 3000,
        });
      }, 50);

      // 🔥 Open login modal instead of navigating away
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("open-login-modal", { detail: true })
        );
      }, 100);
    }
  }, [isAuth, isChecking]);

  // While checking auth, render nothing
  if (isChecking) return null;

  // 🔥 If not logged in, DO NOT navigate → show nothing, modal appears
  if (!isAuth) return null;

  // Otherwise load the protected page
  return <Outlet />;
}
