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
<<<<<<< HEAD
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
=======
    <aside className="fixed left-0 top-0 bg-gradient-to-b from-green-900 via-emerald-800 to-green-800 text-white h-screen p-6 flex flex-col shadow-2xl w-64 overflow-y-auto">
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
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

<<<<<<< HEAD
      {/* Copyright */}
      <div className="mt-auto pt-6 border-t border-green-700/50 text-center text-xs text-green-300">
        © {new Date().getFullYear()} ChurchLink  
        <br />
        All rights reserved.
=======
      <div className="mt-auto pt-6 border-t border-green-700/50 flex flex-col gap-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-800/40 shadow-inner select-none w-full">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-semibold text-green-200">Mitsu</p>
            <p className="text-xs text-green-400">Admin</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold transition-colors"
        >
          Logout
        </button>
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
      </div>
    </aside>
  );
}

export default Sidebar;