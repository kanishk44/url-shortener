import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/auth/check", {
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok && data.authenticated) {
          setIsAuthenticated(true);
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
      }
    };

    checkAuthStatus();
  }, [navigate, setIsAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Authenticating...</div>
    </div>
  );
};

export default AuthCallback;
