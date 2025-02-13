import React, { useState } from "react";

const UrlShortenerForm = () => {
  const [formData, setFormData] = useState({
    longUrl: "",
    customAlias: "",
    topic: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/url/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setResult(data);
      setFormData({ longUrl: "", customAlias: "", topic: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      alert("Short URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="longUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Long URL *
          </label>
          <input
            type="url"
            id="longUrl"
            required
            value={formData.longUrl}
            onChange={(e) =>
              setFormData({ ...formData, longUrl: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com/very/long/url"
          />
        </div>

        <div>
          <label
            htmlFor="customAlias"
            className="block text-sm font-medium text-gray-700"
          >
            Custom Alias (optional)
          </label>
          <input
            type="text"
            id="customAlias"
            value={formData.customAlias}
            onChange={(e) =>
              setFormData({ ...formData, customAlias: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="my-custom-url"
          />
        </div>

        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700"
          >
            Topic (optional)
          </label>
          <select
            id="topic"
            value={formData.topic}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a topic</option>
            <option value="acquisition">Acquisition</option>
            <option value="activation">Activation</option>
            <option value="retention">Retention</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-900">URL Shortened!</h3>
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={result.shortUrl}
              className="flex-1 p-2 border border-gray-300 rounded-md bg-white"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortenerForm;
