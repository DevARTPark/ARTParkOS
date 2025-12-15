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
} from "lucide-react";
import { Role } from "../../types";

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const getNavItems = () => {
    switch (role) {
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
          { icon: Building2, label: "Facilities", path: "/founder/facilities" }, // route handled by ExternalRedirect
          { icon: Coins, label: "Finance", path: "/founder/finance" },
          { icon: FileText, label: "Reviews", path: "/founder/reviews" },
          { icon: Users, label: "My Team", path: "/founder/my-team" },
          { icon: Users, label: "Other Startups", path: "/founder/ecosystem" },
        ];
      case "admin":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/admin/dashboard",
          },
          { icon: PieChart, label: "Portfolio", path: "/admin/portfolio" },
          { icon: FileText, label: "Reviews", path: "/admin/reviews" },
          { icon: Building2, label: "Resources", path: "/admin/resources" },
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
            label: "Assigned Tasks", // <--- CHANGED LABEL
            path: "/reviewer/tasks", // <--- CHANGED PATH
          },
          { icon: PieChart, label: "Portfolio", path: "/reviewer/portfolio" },
          { icon: Users, label: "Users", path: "/reviewer/users" },
          { icon: Calendar, label: "Calendar", path: "/reviewer/calendar" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const getSettingsPath = (role: Role) => {
    if (role === 'founder') return '/founder/settings';
    if (role === 'reviewer') return '/reviewer/settings';
    if (role === 'admin') return '/admin/settings';
    return '/settings';
  };

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl tracking-tight">ARTPark</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
          {role} Portal
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <NavLink 
          to={getSettingsPath(role)}
          className={({ isActive }) => 
            `flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? "bg-slate-800 text-white" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </NavLink>
        
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center space-x-3 text-slate-400 hover:text-red-400 w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors mt-1"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
