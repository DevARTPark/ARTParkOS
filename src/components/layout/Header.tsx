import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Rocket,
  Building2,
  Beaker,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { projects, startups, facilities, mentors } from "../../data/mockData";
import { API_URL } from "../../config";

export interface HeaderUser {
  name: string;
  role: string;
  avatar?: string;
}

interface HeaderProps {
  title?: string;
  user?: HeaderUser;
  userRole?: string;
}

export function Header({
  title,
  user: initialUser,
  userRole: initialRole,
}: HeaderProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  // Initialize with cached profile if available (Instant Load)
  const [profile, setProfile] = useState<any>(() => {
    const cached = localStorage.getItem("artpark_profile_cache");
    return cached ? JSON.parse(cached) : null;
  });

  // Search & Notifications State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Collaboration Request",
      message: "AgriDrone wants to collaborate.",
      time: "2h ago",
      read: false,
      type: "collab",
      link: "/founder/ecosystem",
    },
    {
      id: 2,
      title: "Assessment Review",
      message: "Your AIRL 3 assessment has been reviewed.",
      time: "1d ago",
      read: true,
      type: "system",
      link: "/founder/reviews",
    },
  ]);

  const loadData = () => {
    const userStr = localStorage.getItem("artpark_user");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);

      // Background Fetch to keep cache updated
      fetch(`${API_URL}/api/founder/profile?userId=${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setProfile(data);
            localStorage.setItem("artpark_profile_cache", JSON.stringify(data));
          }
        })
        .catch((err) => console.error("Header fetch error:", err));
    }
  };

  useEffect(() => {
    loadData();

    // Listen for updates from Settings page
    const handleProfileUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setProfile((prev: any) => ({ ...prev, ...detail }));
        // Update cache so next refresh is fast
        localStorage.setItem(
          "artpark_profile_cache",
          JSON.stringify({ ...profile, ...detail })
        );
      }
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profile-updated", handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("artpark_user");
    localStorage.removeItem("artpark_profile_cache"); // Clear cache on logout
    navigate("/login");
  };

  const displayName =
    profile?.founderName || user?.name || initialUser?.name || "Guest User";
  const displayRole =
    profile?.designation || user?.role || initialRole || "Visitor";
  const displayAvatar = profile?.avatarUrl || initialUser?.avatar;

  const getProfilePath = (role?: string) => {
    const targetRole = role || user?.role;
    switch (targetRole) {
      case "founder":
        return "/founder/settings";
      case "admin":
        return "/admin/settings";
      case "reviewer":
        return "/reviewer/settings";
      case "supplier":
        return "/supplier/profile";
      case "mentor":
        return "/mentor/profile";
      case "lab_owner":
        return "/lab-owner/settings";
      default:
        return "/settings";
    }
  };

  // Search Logic
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const foundProjects = projects
      .filter((p) => p.name.toLowerCase().includes(lowerQuery))
      .map((p) => ({
        ...p,
        type: "Project",
        icon: Rocket,
        link: `/founder/project/${p.id}`,
      }));
    const foundStartups = startups
      .filter((s) => s.name.toLowerCase().includes(lowerQuery))
      .map((s) => ({
        ...s,
        type: "Startup",
        icon: Building2,
        link: "/admin/portfolio",
      }));
    setSearchResults([...foundProjects, ...foundStartups]);
    setShowResults(true);
  }, [searchQuery]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {title || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        {/* Search */}
        <div className="relative hidden md:block group" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-64 bg-gray-50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          />
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    navigate(r.link);
                    setShowResults(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <r.icon className="w-4 h-4 text-gray-500" />{" "}
                  <span className="text-sm text-gray-700">{r.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5 text-gray-500" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-50">
                <h3 className="font-semibold text-sm">Notifications</h3>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(n.link)}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative group">
          <button className="flex items-center space-x-3 border-l border-gray-200 pl-6 outline-none">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-100 bg-slate-100 flex items-center justify-center">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-slate-500">
                  {displayName.charAt(0)}
                </span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700 leading-none">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 capitalize mt-1">
                {displayRole}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Signed in as</p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "guest@artpark.in"}
              </p>
            </div>
            <Link
              to={getProfilePath(user?.role)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UserIcon className="w-4 h-4 mr-2" /> Profile
            </Link>
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
