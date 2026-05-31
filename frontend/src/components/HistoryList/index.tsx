import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../../store/session";

interface HistoryListProps {
  onClose: () => void;
}

export function HistoryList({ onClose }: HistoryListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const navigate = useNavigate();

  const history = useSession((s) => s.history) || [];
  const currentSessionId = useSession((s) => s.sessionId);
  const loadSession = useSession((s) => s.loadSession);
  const resetSession = useSession((s) => s.reset);

  if (history.length === 0) {
    return (
      <p className="px-2 text-xs text-gray-600 italic">
        Nenhuma análise recente
      </p>
    );
  }

  return (
    <>
      {history.map((s) => {
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
              to={"/summary"}
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
      })}
    </>
  );
}