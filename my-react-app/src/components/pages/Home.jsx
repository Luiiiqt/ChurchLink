import React from "react";

export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-green-900">Home</h2>

      {/* Welcome Message */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-green-700 mb-2">Welcome to ChurchLink!</h3>
        <p className="text-gray-700">
          ChurchLink is your centralized platform to manage users, view analytics, and access the dashboard quickly.
          Use the sidebar to navigate between sections like Dashboard, User Management, and Settings.
        </p>
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Quick Links</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Go to Dashboard to view system statistics and recent activity.</li>
          <li>Manage users in the User Management page.</li>
          <li>Check settings and customize your account.</li>
        </ul>
      </div>

      <p className="text-gray-500 mt-4">
        This Home page serves as a starting point for navigating ChurchLink efficiently.
      </p>
    </div>
  );
}
