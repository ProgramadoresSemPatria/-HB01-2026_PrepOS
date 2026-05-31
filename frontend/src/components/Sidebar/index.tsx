import {
  Code,
  Lightbulb,
  Map,
  Mic,
  SquarePen,
  MoreVertical,
  ScrollText,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../../store/session";

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
    label: "Resumo da análise",
    to: "/summary",
    icon: <ScrollText {...NAVIGATION_ICONS_SIZE} />,
  },
  {
    label: "Plano de Estudos",
    to: "/roadmap",
    icon: <Map {...NAVIGATION_ICONS_SIZE} />,
  },
  {
    label: "Desafios Técnicos",
    to: "/code-challenge",
    icon: <Code {...NAVIGATION_ICONS_SIZE} />,
  },
  {
    label: "Melhor Pitch",
    to: "/pitch",
    icon: <Lightbulb {...NAVIGATION_ICONS_SIZE} />,
  },
  {
    label: "Simular Entrevista",
    to: "/interview",
    icon: <Mic {...NAVIGATION_ICONS_SIZE} />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const navigate = useNavigate();

  const resetSession = useSession((s) => s.reset);
  const history = useSession((s) => s.history) || [];
  const currentSessionId = useSession((s) => s.sessionId);
  const loadSession = useSession((s) => s.loadSession);
  const matchScore = useSession((s) => s.matchScore);
  const hasAnalysis = matchScore !== null;

  const baseLinkStyle =
    "flex items-center text-sm font-medium transition-all duration-200 py-2.5 rounded-lg";
  const activeLinkStyle = "bg-[#3ecf8e]/10 text-[#3ecf8e]";
  const inactiveLinkStyle =
    "text-[#ffffff] hover:text-[#3ecf8e] hover:bg-white/5";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-[#171717]/70 border-r border-gray-700 flex flex-col gap-6 shrink-0 transition-all duration-300 ease-in-out
        md:fixed md:translate-x-0 
        ${isOpen ? "translate-x-0 shadow-2xl w-full" : "-translate-x-full w-64"}
        ${isCollapsed ? "md:w-20" : "md:w-72"}
      `}
    >
      <div
        className={`flex items-start pt-4 h-16 px-5 ${isCollapsed ? "justify-center" : "justify-between"}`}
      >
        <div
          className={`transition-all duration-300 ${isCollapsed ? "hidden" : "w-auto opacity-100"}`}
        >
          <h1 className="text-xl font-bold text-[#3ecf8e] whitespace-nowrap">
            CareerSync
          </h1>
          <span className="text-sm text-gray-400 whitespace-nowrap">
            Sincronizando você e sua vaga!
          </span>
        </div>

        <button
          onClick={onToggleCollapse}
          className="hidden md:flex text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>

        <button
          onClick={onClose}
          className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
        >
          <X />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        <NavLink
          key={"/new"}
          to={"/new"}
          onClick={() => {
            onClose();
            resetSession();
          }}
          title={isCollapsed ? "Nova análise" : undefined}
          className={({ isActive }) =>
            `${baseLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle} ${isCollapsed ? "justify-center px-0" : "px-3"}`
          }
        >
          <span className="shrink-0">
            <SquarePen {...NAVIGATION_ICONS_SIZE} />
          </span>
          <span
            className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isCollapsed ? "w-0 opacity-0" : "ml-3 w-auto opacity-100"}`}
          >
            Nova análise
          </span>
        </NavLink>

        <div
          className={`px-2 transition-opacity duration-300 ${
            isCollapsed
              ? "opacity-0 pointer-events-none hidden"
              : "opacity-100 block"
          }`}
        >
          <h2 className="mt-2 mb-1 text-xs font-semibold text-[#9a9a9a] uppercase tracking-wider">
            Sua preparação
          </h2>
        </div>

        {NAVIGATION_ITEMS.map((item) => {
          const isDisabled = !hasAnalysis;

          return (
            <NavLink
              key={item.to}
              to={isDisabled ? "#" : item.to}
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                  return;
                }
                onClose();
              }}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `${baseLinkStyle} ${
                  isDisabled
                    ? "opacity-35 cursor-not-allowed text-gray-500 pointer-events-none select-none"
                    : isActive
                      ? activeLinkStyle
                      : inactiveLinkStyle
                } ${isCollapsed ? "justify-center px-0" : "px-3"}`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isCollapsed ? "w-0 opacity-0" : "ml-3 w-auto opacity-100"}`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div
        className={`px-2 transition-opacity duration-300 ${
          isCollapsed
            ? "opacity-0 pointer-events-none hidden"
            : "opacity-100 block"
        }`}
      >
        <h2 className="text-xs px-2 font-semibold text-[#9a9a9a] uppercase tracking-wider">
          Histórico
        </h2>
        <div className="flex flex-col gap-2 mt-3 max-h-[250px] overflow-y-auto pr-1">
          {history.length > 0 ? (
            history.map((s) => {
              const isHistoryActive = s.sessionId === currentSessionId;

              return (
                <div
                  key={s.sessionId}
                  className={`flex items-center gap-1 w-full group relative rounded-lg transition-colors ${
                    isHistoryActive
                      ? "bg-[#3ecf8e]/10 text-[#3ecf8e]"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="relative z-10 pl-1 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === s.sessionId ? null : s.sessionId,
                        );
                      }}
                      className="text-[#3ecf8e] hover:text-white rounded transition-colors"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {openMenuId === s.sessionId && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />

                        <div className="absolute left-5 bg-[#202020] border border-gray-600 rounded-lg shadow-2xl z-20 min-w-[75px] animate-in fade-in zoom-in-95 duration-150">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              useSession.setState((state) => ({
                                history: state.history.filter(
                                  (item) => item.sessionId !== s.sessionId,
                                ),
                              }));

                              setOpenMenuId(null);
                              
                              if (s.sessionId === currentSessionId) {
                                resetSession();
                                navigate("/new");
                              }
                            }}
                            className="w-full px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors font-medium"
                          >
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <NavLink
                    to={`/summary`}
                    onClick={() => {
                      onClose();
                      loadSession(s.sessionId);
                    }}
                    className={`flex-1 truncate py-1 block text-sm select-none transition-colors ${
                      isHistoryActive
                        ? "text-[#3ecf8e]"
                        : "text-gray-300 hover:text-[#3ecf8e]"
                    }`}
                  >
                    {s.jobTitle}
                  </NavLink>
                </div>
              );
            })
          ) : (
            <p className="px-2 text-xs text-gray-600 italic">
              Nenhuma análise recente
            </p>
          )}
        </div>
      </div>

      <div
        className={`mt-auto text-xs text-[#9a9a9a] px-5 pb-6 transition-all duration-300 ${isCollapsed ? "text-center px-0" : ""}`}
      >
        {isCollapsed ? "©" : "© CareerSync"}
      </div>
    </aside>
  );
}