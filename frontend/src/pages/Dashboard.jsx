import React from "react";
import UrlShortenerForm from "../components/UrlShortenerForm";
import UserUrls from "../components/UserUrls";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UrlShortenerForm />
      <div className="mt-8">
        <UserUrls />
      </div>
    </div>
  );
};

export default Dashboard;
