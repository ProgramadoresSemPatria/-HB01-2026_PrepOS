import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#171717] text-[#ffffff] relative overflow-hidden">
      
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-12 h-12 bg-[#202020] text-[#3ecf8e] rounded-full flex items-center justify-center shadow-lg border border-gray-700 hover:bg-gray-800 transition-colors"
      >
        <Menu />
      </button>

      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isDesktopCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
      />

      <main
        className={`flex-1 h-screen overflow-y-auto relative p-6 pt-24 md:p-10 md:pt-10 transition-all duration-300 ${
          isDesktopCollapsed ? "md:ml-20" : "md:ml-72"
        }`}
      >
        <div className="w-full max-w-3xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}