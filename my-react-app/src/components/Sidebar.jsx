import { useState } from "react";

function Sidebar({ status, currentPage, setCurrentPage }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: "🏠", text: "Dashboard", page: "dashboard" },
    { icon: "👥", text: "Users", page: "users" },
    { icon: "📊", text: "Analytics", page: "analytics" },
    { icon: "⚙️", text: "Settings", page: "settings" },
  ];

  if (!status) return null;

  return (
    <aside
      className={`bg-gradient-to-b from-green-900 via-emerald-800 to-green-800 text-white min-h-screen p-6 flex flex-col shadow-2xl ${
        collapsed ? "w-20" : "w-64"
      } transition-width duration-300`}
    >
      {/* Logo/Brand Section */}
      <div className={`mb-10 ${collapsed ? "hidden" : "block"}`}>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent select-none">
          ChurchLink
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mt-3 shadow-lg"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <button
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  currentPage === item.page
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50 scale-105"
                    : "hover:bg-green-700/70 hover:translate-x-1"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-green-400/0 via-emerald-400/25 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    currentPage === item.page ? "opacity-100" : ""
                  }`}
                ></div>

                <span
                  className={`text-2xl relative z-10 transition-transform duration-300 ${
                    currentPage === item.page ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <span
                    className={`font-semibold relative z-10 select-none ${
                      currentPage === item.page ? "text-white" : "text-green-200 group-hover:text-white"
                    }`}
                  >
                    {item.text}
                  </span>
                )}

                {currentPage === item.page && !collapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto pt-6 border-t border-green-700/50 flex flex-col items-center gap-3">
        {!collapsed && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-800/40 shadow-inner select-none w-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-semibold text-green-200">User Name</p>
              <p className="text-xs text-green-400">Admin</p>
            </div>
          </div>
        )}

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 text-green-300 hover:text-green-100 transition-colors duration-300 focus:outline-none"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
