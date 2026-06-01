import {
  Code,
  Lightbulb,
  Map,
  Mic,
  SquarePen,
  ScrollText,
} from "lucide-react";
import type { ReactNode } from "react";
import { useSession } from "../../store/session";
import { SidebarLink } from "../SidebarLink";

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

interface NavigationMenuProps {
  isCollapsed: boolean;
  onClose: () => void;
}

export function NavigationMenu({ isCollapsed, onClose }: NavigationMenuProps) {
  const resetSession = useSession((s) => s.reset);
  const matchScore = useSession((s) => s.matchScore);
  const hasAnalysis = matchScore !== null;

  return (
    <nav className="flex flex-col gap-1 px-3">
      <SidebarLink
        to="/new"
        label="Nova análise"
        icon={<SquarePen {...NAVIGATION_ICONS_SIZE} />}
        isCollapsed={isCollapsed}
        onClick={() => {
          onClose();
          resetSession();
        }}
      />

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

      {NAVIGATION_ITEMS.map((item) => (
        <SidebarLink
          key={item.to}
          to={item.to}
          label={item.label}
          icon={item.icon}
          isCollapsed={isCollapsed}
          isDisabled={!hasAnalysis}
          onClick={() => onClose()}
        />
      ))}
    </nav>
  );
}