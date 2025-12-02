import React, { useState } from "react";

export default function UserManagement() {
  // Example in-memory users for display
  const [users, setUsers] = useState([
    { id: 1, username: "john_doe", role: "Admin" },
    { id: 2, username: "jane_smith", role: "User" },
    { id: 3, username: "mike_jones", role: "User" },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-green-900">User Management</h2>
      <p className="text-gray-700 mb-4">
        View and manage your users below. You can add, edit, or delete users as needed.
      </p>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-green-200">
              <th className="px-4 py-2 text-green-700">ID</th>
              <th className="px-4 py-2 text-green-700">Username</th>
              <th className="px-4 py-2 text-green-700">Role</th>
              <th className="px-4 py-2 text-green-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
