import { useNavigate } from "react-router-dom";

function Sidebar({ status, currentPage, setCurrentPage, isOpen }) {
  const navigate = useNavigate();
  if (!status) return null;

  const menuItems = [
    { icon: "🏠", text: "Dashboard", page: "dashboard", path: "/" },
    { icon: "👥", text: "Members", page: "members", path: "/members" },
    { icon: "📋", text: "Attendance", page: "attendance", path: "/attendance" },
    { icon: "📂", text: "Ministries", page: "ministries", path: "/ministries" },
    { icon: "🎯", text: "Activities", page: "activities", path: "/activities" },
    { icon: "📊", text: "Reports", page: "reports", path: "/reports" },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen w-64 p-6 flex flex-col
        bg-gradient-to-b from-green-900 via-emerald-800 to-green-800
        text-white shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300
      `}
    >
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="ChurchLink Logo" 
            className="w-10 h-10 rounded-full shadow-lg ring-2 ring-green-400/50"
          />
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent">
            ChurchLink
          </h2>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.page}>
              <button
                onClick={() => {
                  setCurrentPage(item.page);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  currentPage === item.page
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg scale-105"
                    : "hover:bg-green-700/70"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-base">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Copyright */}
      <div className="mt-4 pt-4 border-t border-green-700/50 text-center text-xs text-green-300">
        © {new Date().getFullYear()} ChurchLink
        <br />
        All rights reserved.
      </div>
    </aside>
  );
}

export default Sidebar;