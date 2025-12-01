function Header({ onSidebarToggle }) {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <button
        onClick={onSidebarToggle}
        className="text-emerald-700 text-3xl hover:text-green-600 focus:outline-none transition-colors duration-300"
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      <div className="flex items-center space-x-4 relative">
        <span className="font-semibold text-emerald-800 text-lg select-none">ChurchLink Admin</span>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl select-none shadow-md relative">
          U
          {/* Notification badge */}
          <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </div>
      </div>
    </header>
  );
}

export default Header;
