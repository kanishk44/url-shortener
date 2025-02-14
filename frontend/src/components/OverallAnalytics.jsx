import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

const OverallAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/url/overall/analytics", {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch overall analytics");
        }

        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading overall analytics...</div>
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

  if (!analytics) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Total URLs</h3>
          <p className="text-4xl font-bold text-blue-600">
            {analytics.totalUrls}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Total Clicks</h3>
          <p className="text-4xl font-bold text-green-600">
            {analytics.totalClicks}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Unique Users</h3>
          <p className="text-4xl font-bold text-purple-600">
            {analytics.uniqueUsers}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          Clicks Over Time (Last 7 Days)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.clicksByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(parseISO(date), "MMM d")}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => format(parseISO(date), "MMM d, yyyy")}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Clicks"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Operating Systems</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.osType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="osName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="uniqueClicks"
                  name="Unique Clicks"
                  fill="#8884d8"
                />
                <Bar dataKey="uniqueUsers" name="Unique Users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Device Types</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.deviceType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="deviceName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="uniqueClicks"
                  name="Unique Clicks"
                  fill="#8884d8"
                />
                <Bar dataKey="uniqueUsers" name="Unique Users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallAnalytics;
