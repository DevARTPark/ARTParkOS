// src/components/layout/Header.tsx
import React from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface HeaderUser {
  name: string;
  role: string;
  avatar?: string;
}

interface HeaderProps {
  title?: string;
  user?: HeaderUser;
}

export function Header({ title, user }: HeaderProps) {
  const navigate = useNavigate();

  // Default fallback if no user provided
  const currentUser = user || {
    name: "Guest User",
    role: "Visitor",
    avatar: "",
  };

  const handleLogout = () => {
    localStorage.removeItem("artpark_user");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {title || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-gray-50 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-3 border-l border-gray-200 pl-6 outline-none">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-100 bg-slate-100 flex items-center justify-center">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-slate-500">
                  {currentUser.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700 leading-none">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 capitalize mt-1">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Signed in as</p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.name}
              </p>
            </div>
            <a
              href={`/${currentUser.role}/profile`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UserIcon className="w-4 h-4 mr-2" /> Profile
            </a>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
