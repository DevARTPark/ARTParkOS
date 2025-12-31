import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Rocket,
  Building2,
  Check,
  Menu,
  Briefcase,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { projects, startups } from "../../data/mockData";
import { API_URL } from "../../config";

export interface HeaderUser {
  name: string;
  role: string;
  roles?: string[];
  avatar?: string;
}

interface HeaderProps {
  title?: string;
  user?: HeaderUser;
  userRole?: string;
  onMenuClick?: () => void;
}

export function Header({
  title,
  user: initialUser,
  userRole: initialRole,
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();

  // --- STATE ---
  const [user, setUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<string>("");

  // Changed to click-toggle for better mobile support
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Initialize Profile
  const [profile, setProfile] = useState<any>(() => {
    try {
      const currentUserStr = localStorage.getItem("artpark_user");
      if (!currentUserStr) return null;
      const currentUser = JSON.parse(currentUserStr);
      const cacheKey = `artpark_profile_cache_${currentUser.id}`;
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  // Search & Notifications
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications] = useState([
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

  // --- CLICK OUTSIDE HANDLER ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = () => {
    const userStr = localStorage.getItem("artpark_user");
    const roleStr = localStorage.getItem("active_role");

    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      const currentRole = roleStr || parsedUser.roles?.[0] || "founder";
      setActiveRole(currentRole);

      fetch(`${API_URL}/api/user/profile?userId=${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          const profileData = data.profile || {};
          if (profileData && Object.keys(profileData).length > 0) {
            setProfile(profileData);
            localStorage.setItem(
              `artpark_profile_cache_${parsedUser.id}`,
              JSON.stringify(profileData)
            );
          }
        })
        .catch((err) => console.error("Header fetch error:", err));
    }
  };

  useEffect(() => {
    loadData();
    const handleProfileUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const userStr = localStorage.getItem("artpark_user");
      if (detail && userStr) {
        const parsedUser = JSON.parse(userStr);
        setProfile((prev: any) => ({ ...prev, ...detail }));
        localStorage.setItem(
          `artpark_profile_cache_${parsedUser.id}`,
          JSON.stringify({ ...profile, ...detail })
        );
      }
    };
    window.addEventListener("profile-updated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profile-updated", handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    const userStr = localStorage.getItem("artpark_user");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        localStorage.removeItem(`artpark_profile_cache_${parsedUser.id}`);
      } catch (e) {
        /* ignore */
      }
    }
    localStorage.removeItem("artpark_user");
    localStorage.removeItem("active_role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRoleSwitch = (newRole: string) => {
    localStorage.setItem("active_role", newRole);
    setActiveRole(newRole);
    setIsProfileOpen(false); // Close menu after switching

    const dashboardMap: Record<string, string> = {
      founder: "/founder/dashboard",
      admin: "/admin/dashboard",
      reviewer: "/reviewer/dashboard",
      supplier: "/supplier/dashboard",
      mentor: "/mentor/dashboard",
      lab_owner: "/lab-owner/dashboard",
    };
    navigate(dashboardMap[newRole] || "/");
  };

  const displayName =
    profile?.fullName || user?.name || initialUser?.name || "Guest User";
  const displayRole = activeRole || user?.role || initialRole || "Visitor";
  const displayAvatar = profile?.avatarUrl || initialUser?.avatar;

  const getProfilePath = (role?: string) => {
    const targetRole = role || activeRole;
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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* LEFT: Mobile Menu Button & Title */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[200px] md:max-w-none">
          {title || "Dashboard"}
        </h1>
      </div>

      {/* RIGHT: Search, Notifications, Profile */}
      <div className="flex items-center space-x-2 md:space-x-6">
        {/* Search (Hidden on small mobile) */}
        <div className="relative hidden sm:block group" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-48 md:w-64 bg-gray-50 transition-all"
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
        <div className="relative" ref={notificationRef}>
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
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
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

        {/* Profile Dropdown (Now contains Role Switcher) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 md:space-x-3 md:border-l md:border-gray-200 md:pl-6 outline-none"
          >
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
                {displayRole.replace("_", " ")}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "guest@artpark.in"}
                </p>
              </div>

              {/* ROLE SWITCHER SECTION */}
              {user?.roles && user.roles.length > 1 && (
                <div className="py-1 border-b border-gray-100">
                  <div className="px-4 py-1.5 flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                    <Briefcase className="w-3 h-3" /> Switch View
                  </div>
                  {user.roles.map((role: string) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                    >
                      <span
                        className={`text-sm capitalize ${
                          activeRole === role
                            ? "font-medium text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {role.replace("_", " ")}
                      </span>
                      {activeRole === role && (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Navigation Links */}
              <div className="py-1">
                <Link
                  to={getProfilePath(activeRole)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <UserIcon className="w-4 h-4 mr-2 text-gray-400" /> Profile
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
