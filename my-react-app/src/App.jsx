import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useState } from "react";

const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);

  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar status={sidebarToggle} />

      <div className="flex flex-col flex-1">
        <Header onSidebarToggle={toggleSidebar} />
        <main className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-4">welcome to ChurchLink</h1>
          <p>Dasboard Area.</p>
        </main>
      </div>
    </div>
  );
};

export default App;