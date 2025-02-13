import React from "react";
import { useAuth } from "../context/AuthContext";
import UrlShortenerForm from "./UrlShortenerForm";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">URL Shortener</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.profilePicture}
                  alt={user?.displayName}
                />
                <span className="text-gray-700">{user?.displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Short URL
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Enter a long URL to create a shortened version.
            </p>
          </div>
          <UrlShortenerForm />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
