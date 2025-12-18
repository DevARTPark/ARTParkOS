import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Activity, 
  MapPin, 
  ArrowRight,
  X
} from 'lucide-react';

// 1. IMPORT SHARED DATA
import { reviewerStartups, StartupEntry } from '../../data/reviewerData';

export function ReviewerPortfolio() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE FOR FILTERS ---
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [airlFilter, setAirlFilter] = useState('All'); 
  const [pendingOnly, setPendingOnly] = useState(false);
  const [domainFilter, setDomainFilter] = useState('All');

  // --- 1. INITIALIZE FILTERS FROM DASHBOARD NAVIGATION ---
  useEffect(() => {
    if (location.state) {
      const { filterType, value } = location.state as { filterType: string; value: any };
      
      // Reset defaults
      setStatusFilter('All');
      setPendingOnly(false);
      setAirlFilter('All');
      setDomainFilter('All');

      // Apply specific filter from Dashboard click
      if (filterType === 'status') {
        setStatusFilter(value);
      } else if (filterType === 'pending') {
        setPendingOnly(true);
      } else if (filterType === 'graduated') {
        setAirlFilter('graduated');
      } else if (filterType === 'airl') {
        // This handles the click from the specific Bar in the chart (e.g., "5")
        setAirlFilter(value.toString()); 
      }
      
      // Clear state so browser refresh doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // --- 2. FILTERING LOGIC ---
  const filteredStartups = reviewerStartups.filter((s: StartupEntry) => {
    // 1. Search
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.domain.toLowerCase().includes(search.toLowerCase());
    
    // 2. Status Filter
    const matchesStatus = statusFilter === 'All' || s.healthStatus === statusFilter;

    // 3. Pending Review Filter
    const matchesPending = !pendingOnly || s.hasPendingReview;

    // 4. Domain Filter
    const matchesDomain = domainFilter === 'All' || s.domain === domainFilter;

    // 5. AIRL/Graduated Filter (UPDATED LOGIC)
    let matchesAirl = true;
    if (airlFilter === 'All') {
      matchesAirl = true;
    } else if (airlFilter === 'graduated') {
      matchesAirl = s.airlLevel >= 7;
    } else if (airlFilter === '1-3') {
      matchesAirl = s.airlLevel >= 1 && s.airlLevel <= 3;
    } else if (airlFilter === '4-6') {
      matchesAirl = s.airlLevel >= 4 && s.airlLevel <= 6;
    } else if (airlFilter === '7-9') {
      matchesAirl = s.airlLevel >= 7 && s.airlLevel <= 9;
    } else {
      // Handle specific numeric string (e.g. "5")
      matchesAirl = s.airlLevel.toString() === airlFilter;
    }

    return matchesSearch && matchesStatus && matchesPending && matchesAirl && matchesDomain;
  });

  const uniqueDomains = Array.from(new Set(reviewerStartups.map(s => s.domain)));

  // Clear all filters helper
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setAirlFilter('All');
    setPendingOnly(false);
    setDomainFilter('All');
  };

  return (
    <DashboardLayout role="reviewer" title="Startup Portfolio">
      
      {/* Controls Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 space-y-4">
        
        {/* Row 1: Search and Main Toggles */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, domain..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             {/* Pending Toggle */}
             <button 
              onClick={() => setPendingOnly(!pendingOnly)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2 ${
                pendingOnly 
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                  : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Pending Reviews
              {pendingOnly && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
            </button>

            {/* Clear Filters Button */}
            {(statusFilter !== 'All' || airlFilter !== 'All' || pendingOnly || domainFilter !== 'All' || search) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:bg-red-50">
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Row 2: Detailed Dropdowns */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">Health:</span>
            <div className="flex gap-1">
              {['All', 'Green', 'Yellow', 'Red'].map(status => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
                    statusFilter === status 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>

          {/* AIRL Filter (UPDATED: Added specific levels) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">Stage:</span>
            <select 
              className="text-xs border-gray-200 rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              value={airlFilter}
              onChange={(e) => setAirlFilter(e.target.value)}
            >
              <option value="All">All Stages</option>
              <optgroup label="Broad Ranges">
                <option value="graduated">Graduated (7+)</option>
                <option value="1-3">Early (AIRL 1-3)</option>
                <option value="4-6">Growth (AIRL 4-6)</option>
                <option value="7-9">Scale (AIRL 7-9)</option>
              </optgroup>
              <optgroup label="Specific Levels">
                {Array.from({length: 9}, (_, i) => i + 1).map(l => (
                  <option key={l} value={l}>Level {l}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Domain Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">Domain:</span>
            <select 
              className="text-xs border-gray-200 rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              <option value="All">All Domains</option>
              {uniqueDomains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Grid Display */}
      {filteredStartups.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500">No startups match the selected filters.</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>Reset Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStartups.map((startup: StartupEntry) => (
            <Card key={startup.id} className="hover:shadow-lg transition-shadow group relative overflow-hidden h-full flex flex-col">
              {/* Status Strip */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                startup.healthStatus === 'Green' ? 'bg-green-500' : 
                startup.healthStatus === 'Yellow' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />

              <CardContent className="p-6 pl-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {/* Simple Avatar */}
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200">
                      {startup.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{startup.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" /> Bangalore
                        <span className="mx-2">•</span>
                        {startup.domain}
                      </div>
                    </div>
                  </div>
                  {startup.hasPendingReview && (
                    <Badge variant="warning" className="text-[10px]">Review Pending</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Current Level</p>
                    <div className="flex items-center font-bold text-blue-600">
                      <Activity className="w-4 h-4 mr-1" /> AIRL {startup.airlLevel}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <div className={`flex items-center font-bold ${
                      startup.healthStatus === 'Green' ? 'text-green-600' : 
                      startup.healthStatus === 'Yellow' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="w-4 h-4 mr-1" /> {startup.healthStatus}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Button 
                    className="w-full group-hover:bg-blue-700" 
                    onClick={() => navigate(`/reviewer/portfolio/${startup.id}`)}
                  >
                    View Full Profile <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
}