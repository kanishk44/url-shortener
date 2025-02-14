import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    // Redirect to Google OAuth login
    window.location.href = "http://localhost:5001/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.722-1.405,3.074-2.936,3.952c-1.531,0.878-3.362,1.116-5.064,0.672c-1.702-0.444-3.163-1.555-4.127-3.129c-0.964-1.574-1.307-3.467-0.972-5.284c0.335-1.817,1.333-3.412,2.907-4.376c1.574-0.964,3.467-1.307,5.284-0.972c1.817,0.335,3.412,1.333,4.376,2.907l0.014,0.024l3.09-3.09c-2.012-2.747-5.245-4.282-8.629-4.282c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12H12.545z" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
