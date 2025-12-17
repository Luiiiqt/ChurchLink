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
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen w-64 p-6 flex flex-col
        bg-gradient-to-b from-green-900 via-emerald-800 to-green-800
        text-white shadow-2xl overflow-y-auto
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent">
          ChurchLink
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mt-3" />
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
                    : "hover:bg-green-700/70 hover:translate-x-1"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Copyright */}
      <div className="mt-auto pt-6 border-t border-green-700/50 text-center text-xs text-green-300">
        © {new Date().getFullYear()} ChurchLink  
        <br />
        All rights reserved.
      </div>
    </aside>
  );
}

export default Sidebar;
