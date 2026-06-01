import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  isCollapsed: boolean;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const baseLinkStyle = "flex items-center text-sm font-medium transition-all duration-200 py-2.5 rounded-lg";
const activeLinkStyle = "bg-[#3ecf8e]/10 text-[#3ecf8e]";
const inactiveLinkStyle = "text-[#ffffff] hover:text-[#3ecf8e] hover:bg-white/5";
const disabledStyle = "opacity-35 cursor-not-allowed text-gray-500 pointer-events-none select-none";

export function SidebarLink({
  to,
  icon,
  label,
  isCollapsed,
  isDisabled = false,
  onClick,
}: SidebarLinkProps) {
  return (
    <NavLink
      to={isDisabled ? "#" : to}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        `${baseLinkStyle} ${
          isDisabled ? disabledStyle : isActive ? activeLinkStyle : inactiveLinkStyle
        } ${isCollapsed ? "justify-center px-0" : "px-3"}`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span
        className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${
          isCollapsed ? "w-0 opacity-0" : "ml-3 w-auto opacity-100"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
}