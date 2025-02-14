import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import AnalyticsModal from "./AnalyticsModal";

const UserUrls = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch("/api/url/user/urls", {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch URLs");
        }

        setUrls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading your URLs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">You haven't shortened any URLs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Shortened URLs</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {urls.map((url) => (
            <li key={url.shortCode} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium truncate"
                    >
                      {url.shortUrl}
                    </a>
                    <button
                      onClick={() => handleCopy(url.shortUrl)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy URL"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 truncate">
                    {url.longUrl}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                    <span>
                      {format(new Date(url.createdAt), "MMM d, yyyy")}
                    </span>
                    {url.topic && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {url.topic}
                      </span>
                    )}
                    <span>{url.clicks} clicks</span>
                  </div>
                </div>
                <div className="ml-6">
                  <button
                    onClick={() => {
                      setSelectedUrl(url.shortCode);
                      setShowAnalytics(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Analytics
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => {
          setShowAnalytics(false);
          setSelectedUrl(null);
        }}
        shortCode={selectedUrl}
      />
    </div>
  );
};

export default UserUrls;
