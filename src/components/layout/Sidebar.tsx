import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardCheck,
  FileText,
  Calendar,
  Users,
  Settings,
  LogOut,
  Building2,
  PieChart,
  Coins,
  Package,
  UserCircle,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Role } from "../../types";
import artparkLogo from "../../../public/artpark_in_logo.jpg";

interface SidebarProps {
  role: Role;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ role, isCollapsed, toggleSidebar }: SidebarProps) {
  const getNavItems = () => {
    switch (role) {
      // ... (Founder, Admin, Reviewer cases remain unchanged)
      case "founder":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/founder/dashboard",
          },
          {
            icon: ClipboardCheck,
            label: "AIRL Assessment",
            path: "/founder/assessment",
          },
          { icon: FolderKanban, label: "Projects", path: "/founder/projects" },
          { icon: Building2, label: "Facilities", path: "/founder/facilities" },
          { icon: Coins, label: "Finance", path: "/founder/finance" },
          { icon: Users, label: "My Team", path: "/founder/my-team" },
          { icon: Users, label: "Other Startups", path: "/founder/ecosystem" },
          { icon: FileText, label: "Reviews", path: "/founder/reviews" },
        ];
      case "admin":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/admin/dashboard",
          },
          { icon: PieChart, label: "Portfolio", path: "/admin/portfolio" },
          { icon: Coins, label: "Financials", path: "/admin/financials" },
          { icon: FileText, label: "Reports", path: "/admin/reports" },
          { icon: Users, label: "Network", path: "/admin/network" },
          { icon: Users, label: "Users", path: "/admin/users" },
        ];
      case "reviewer":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/reviewer/dashboard",
          },
          {
            icon: ClipboardCheck,
            label: "Assigned Tasks",
            path: "/reviewer/tasks",
          },
          { icon: PieChart, label: "Portfolio", path: "/reviewer/portfolio" },
          { icon: Building2, label: "Resources", path: "/reviewer/resources" },
          { icon: Settings, label: "AIRL Config", path: "/reviewer/assessment-config" },
          { icon: Users, label: "Users", path: "/reviewer/users" },
          { icon: Calendar, label: "Calendar", path: "/reviewer/calendar" },
        ];
      case "supplier":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/supplier/dashboard",
          },
          { icon: Package, label: "My Listings", path: "/supplier/listings" },
          {
            icon: UserCircle,
            label: "Company Profile",
            path: "/supplier/profile",
          },
        ];
      case "mentor":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/mentor/dashboard",
          },
          { icon: Calendar, label: "My Schedule", path: "/mentor/schedule" },
          { icon: Video, label: "My Sessions", path: "/mentor/sessions" },
          { icon: UserCircle, label: "Profile", path: "/mentor/profile" },
        ];
      case "lab_owner":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/lab-owner/dashboard",
          },
          { icon: Calendar, label: "Bookings", path: "/lab-owner/bookings" },
          { icon: Calendar, label: "Schedule", path: "/lab-owner/calendar" }, // <--- ADDED
          {
            icon: Building2,
            label: "Assets & Services",
            path: "/lab-owner/services",
          },
          {
            icon: Settings,
            label: "Lab Settings",
            path: "/lab-owner/settings",
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getSettingsPath = (role: Role) => {
    if (role === "founder") return "/founder/settings";
    if (role === "reviewer") return "/reviewer/settings";
    if (role === "admin") return "/admin/settings";
    if (role === "lab_owner") return "/lab-owner/settings";
    if (role === "mentor") return "/mentor/profile/edit";
    if (role === "supplier") return "/supplier/settings"; // <--- ADDED
    return "/settings";
  };

  return (
    <div
      className={`bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 ease-in-out border-r border-slate-800 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-slate-800 flex items-center justify-between h-20">
        <div
          className={`flex items-center transition-all duration-300 ${
            isCollapsed ? "justify-center w-full" : "space-x-3"
          }`}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
            <img
              src={artparkLogo}
              alt="AP"
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerText = "A";
                  e.currentTarget.parentElement.className =
                    "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg font-bold text-lg";
                }
              }}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <span className="font-bold text-xl tracking-tight block whitespace-nowrap">
              ARTPark
            </span>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              {role} Portal
            </p>
          </div>
        </div>
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  } ${isCollapsed ? "justify-center px-2" : ""}`
                }
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isCollapsed ? "mx-auto" : ""
                  }`}
                />
                <span
                  className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    isCollapsed
                      ? "w-0 opacity-0 overflow-hidden"
                      : "w-auto opacity-100"
                  }`}
                >
                  {item.label}
                </span>
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-slate-700">
                    {item.label}
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-full flex justify-center mb-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <NavLink
          to={getSettingsPath(role)}
          className={({ isActive }) =>
            `flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            } ${isCollapsed ? "justify-center" : ""}`
          }
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span
            className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              isCollapsed
                ? "w-0 opacity-0 overflow-hidden"
                : "w-auto opacity-100"
            }`}
          >
            Settings
          </span>
        </NavLink>
        <button
          onClick={() => {
            localStorage.removeItem("artpark_user");
            window.location.href = "/login";
          }}
          className={`flex items-center space-x-3 text-slate-400 hover:text-red-400 w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors mt-1 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span
            className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              isCollapsed
                ? "w-0 opacity-0 overflow-hidden"
                : "w-auto opacity-100"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
