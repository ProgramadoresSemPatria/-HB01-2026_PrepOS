import { Code, Lightbulb, Map, Mic, SquarePen } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";

interface NavigationItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const NAVIGATION_ICONS_SIZE = {
  size: 18,
  strokeWidth: 2,
};

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Nova análise",
    to: "/upload",
    icon: <SquarePen {...NAVIGATION_ICONS_SIZE} />,
  },
  {
    label: "Roadmap",
    to: "/roadmap",
    icon: <Map {...NAVIGATION_ICONS_SIZE} />,
  },
  {
    label: "LeetCode",
    to: "/leetcode",
    icon: <Code {...NAVIGATION_ICONS_SIZE} />,
  },
  {
    label: "Pitch",
    to: "/pitch",
    icon: <Lightbulb {...NAVIGATION_ICONS_SIZE} />,
  },
  {
    label: "Interview",
    to: "/interview",
    icon: <Mic {...NAVIGATION_ICONS_SIZE} />,
  },
];

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const baseLinkStyle =
    "flex items-center text-sm font-medium transition-all duration-200 py-2.5 rounded-lg";
  const activeLinkStyle = "bg-[#3ecf8e]/10 text-[#3ecf8e]";
  const inactiveLinkStyle =
    "text-[#ffffff] hover:text-[#3ecf8e] hover:bg-white/5";

  const sessions = [
    {
      id: "s1",
      description: "Desenvolvedor Frontend - React/TypeScript (vaga remota)",
    },
    {
      id: "s2",
      description:
        "Engenheiro de Dados - Python, ETL e Big Data (Tempo integral)",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#171717] text-[#ffffff] relative overflow-hidden">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-12 h-12 bg-[#202020] text-[#3ecf8e] rounded-full flex items-center justify-center shadow-lg border border-gray-700 hover:bg-gray-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#171717]/70 border-r border-gray-700 flex flex-col gap-6 shrink-0 transition-all duration-300 ease-in-out
          md:fixed md:translate-x-0 
          ${isSidebarOpen ? "translate-x-0 shadow-2xl w-full" : "-translate-x-full w-64"}
          ${isDesktopCollapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        <div
          className={`flex items-center h-16 px-5 ${isDesktopCollapsed ? "justify-center" : "justify-between"}`}
        >
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            <div>
              <h1 className="text-xl font-bold text-[#3ecf8e] whitespace-nowrap">
                Prep AI
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden md:flex text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
            title={isDesktopCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>
          </button>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              title={isDesktopCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle} ${isDesktopCollapsed ? "justify-center px-0" : "px-3"}`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className={`ml-3 whitespace-nowrap transition-all duration-300 overflow-hidden ${isDesktopCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div
          className={`px-5 transition-opacity duration-300 ${isDesktopCollapsed ? "opacity-0 pointer-events-none hidden" : "opacity-100 block"}`}
        >
          <h2 className="text-xs font-semibold text-[#9a9a9a] uppercase tracking-wider">
            Histórico
          </h2>
          <div className="flex flex-col gap-2 mt-3">
            {sessions.map((s) => (
              <NavLink
                key={s.id}
                to={`/analysis?session_id=${s.id}`}
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-[#3ecf8e] flex items-center gap-2 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 shrink-0 group-hover:text-[#3ecf8e] transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                  />
                </svg>
                <span className="truncate block text-sm">{s.description}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div
          className={`mt-auto text-xs text-[#9a9a9a] px-5 pb-6 transition-all duration-300 ${isDesktopCollapsed ? "text-center px-0" : ""}`}
        >
          {isDesktopCollapsed ? "©" : "© Prep AI"}
        </div>
      </aside>

      <main
        className={`flex-1 h-screen overflow-y-auto relative p-6 pt-24 md:p-10 md:pt-10 transition-all duration-300 ${
          isDesktopCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
