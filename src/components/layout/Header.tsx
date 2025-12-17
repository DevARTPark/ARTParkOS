import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Rocket,       // Project Icon
  Building2,    // Startup Icon
  Beaker,       // Facility Icon
  GraduationCap // Mentor Icon
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Import Data Sources for Search
import { projects, startups, facilities, mentors } from "../../data/mockData";

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

export function Header({ title, user, userRole }: HeaderProps) {
  const navigate = useNavigate();
  
  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  const getProfilePath = (role?: string) => {
    switch (role) {
      case "founder": return "/founder/settings";
      case "admin": return "/admin/settings";
      case "reviewer": return "/reviewer/settings";
      case "supplier": return "/supplier/profile";
      case "mentor": return "/mentor/profile";
      case "lab_owner": return "/lab-owner/settings";
      default: return "/settings";
    }
  };

  // --- Search Logic ---
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    // 1. Projects
    const foundProjects = projects
      .filter(p => p.name.toLowerCase().includes(lowerQuery) || p.domain.toLowerCase().includes(lowerQuery))
      .map(p => ({ ...p, type: 'Project', icon: Rocket, link: `/founder/project/${p.id}` }));

    // 2. Startups
    const foundStartups = startups
      .filter(s => s.name.toLowerCase().includes(lowerQuery))
      .map(s => ({ ...s, type: 'Startup', icon: Building2, link: '/admin/portfolio' }));

    // 3. Facilities
    const foundFacilities = facilities
      .filter(f => f.name.toLowerCase().includes(lowerQuery))
      .map(f => ({ ...f, type: 'Facility', icon: Beaker, link: '/founder/facilities' }));

    // 4. Mentors
    const foundMentors = mentors
      .filter(m => m.name.toLowerCase().includes(lowerQuery) || m.domain.toLowerCase().includes(lowerQuery))
      .map(m => ({ ...m, type: 'Mentor', icon: GraduationCap, link: '/founder/mentors' }));

    setSearchResults([...foundProjects, ...foundStartups, ...foundFacilities, ...foundMentors]);
    setShowResults(true);
  }, [searchQuery]);

  // Click Outside Handler to Close Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (link: string) => {
    navigate(link);
    setShowResults(false);
    setSearchQuery(""); // Clear search after navigation
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {title || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        
        {/* --- Functional Search Bar --- */}
        <div className="relative hidden md:block group" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Search projects, mentors, labs..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-72 bg-gray-50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          />

          {/* Search Dropdown Results */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-2 z-50">
              <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Suggestions
              </p>
              {searchResults.map((result, idx) => (
                <button
                  key={`${result.type}-${idx}`}
                  onClick={() => handleResultClick(result.link)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <div className={`p-2 rounded-full bg-gray-100 text-gray-600`}>
                    <result.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{result.name}</p>
                    <p className="text-xs text-gray-500">{result.type} • {result.domain || result.type}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
             <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 p-4 z-50 text-center">
                <p className="text-sm text-gray-500">No results found.</p>
             </div>
          )}
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
            <Link
              to={getProfilePath(userRole)}
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