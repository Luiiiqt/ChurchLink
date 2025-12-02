import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-green-900">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-green-700">Total Users</h3>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-green-700">Active Sessions</h3>
          <p className="text-2xl font-bold">35</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-green-700">Pending Tasks</h3>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Recent Activity</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>User John registered an account.</li>
          <li>Admin updated user permissions.</li>
          <li>New task assigned to Marketing team.</li>
          <li>Server backup completed successfully.</li>
        </ul>
      </div>

      <p className="text-gray-500 mt-4">
        This dashboard provides a quick overview of system stats, recent activities, and key metrics.
      </p>
    </div>
  );
}
