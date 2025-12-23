import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { 
  Activity, 
  Layout, 
  Search, 
  Filter, 
  TrendingUp,
  X,
  ArrowRight
} from 'lucide-react';

// 1. IMPORT DATA & TYPES
import { reviewerStartups, StartupEntry } from '../../data/reviewerData';

// --- Local Mock Data for Ticker ---
const urgentUpdates = [
  { id: 1, type: 'assessment', text: "GreenField Tech submitted AIRL 3 Assessment", time: "2 hrs ago", link: "/reviewer/review/r1" },
  { id: 2, type: 'report', text: "MediDrone submitted Oct Monthly 1-Pager", time: "5 hrs ago", link: "/reviewer/review/r2" },
  { id: 3, type: 'alert', text: "AgriSense missed Q3 Goal: 'Pilot Deployment'", time: "1 day ago", link: "#" },
];

export function ReviewerDashboard() {
  const navigate = useNavigate();
  
  // --- 2. DYNAMIC DATA LOADING (Fixes Static Charts) ---
  const [startups, setStartups] = useState<StartupEntry[]>(() => {
    // A. Load new projects submitted by founders
    const localProjectsStr = localStorage.getItem('founder_projects');
    const localProjects = localProjectsStr ? JSON.parse(localProjectsStr) : [];

    // B. Map Founder Projects to Reviewer 'StartupEntry' format
    const newStartups: StartupEntry[] = localProjects.map((p: any) => ({
      id: p.id,
      name: p.name,
      domain: p.domain,
      // If it's new/unverified, visualize it at their estimated level so it appears in the pipeline
      airlLevel: p.isNew ? p.estimatedAIRL : p.currentAIRL, 
      healthStatus: 'Yellow', // Default status for new/pending items
      lastReviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Today
      hasPendingReview: true, // Always true for new submissions
      isHighPriority: p.isNew || false
    }));

    // C. Merge Static Mock Data + New Dynamic Data
    // We filter out any IDs from mock data that might conflict (unlikely, but safe)
    const existingIds = new Set(newStartups.map(s => s.id));
    const filteredStatic = reviewerStartups.filter(s => !existingIds.has(s.id));

    return [...filteredStatic, ...newStartups];
  });

  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [domainFilter, setDomainFilter] = useState('all');
  const [airlFilter, setAirlFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // --- COMPARISON CHART STATE ---
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const [startDate, setStartDate] = useState(threeMonthsAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  // --- NAVIGATION HANDLER ---
  const navigateToPortfolio = (filterType: string, value: any) => {
    navigate('/reviewer/portfolio', { 
      state: { filterType, value } 
    });
  };

  // --- HELPER: Parse Mock Data Dates ---
  const parseMockDate = (dateStr: string) => {
    // If it looks like "Oct 15", add year. If it's ISO (from local storage), parse directly.
    if (dateStr.includes('-') && dateStr.length > 6) return new Date(dateStr);
    
    const currentYear = new Date().getFullYear();
    const date = new Date(`${dateStr}, ${currentYear}`);
    if (date > new Date()) {
      date.setFullYear(currentYear - 1);
    }
    return date;
  };

  // --- FILTERING LOGIC (Using dynamic 'startups' state) ---
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'all' || startup.domain === domainFilter;
    const matchesAirl = airlFilter === 'all' || startup.airlLevel.toString() === airlFilter;
    const matchesStatus = statusFilter === 'all' || startup.healthStatus === statusFilter;
    return matchesSearch && matchesDomain && matchesAirl && matchesStatus;
  });

  // --- METRIC CALCULATIONS ---
  const totalStartups = startups.length;
  const pendingReviews = startups.filter(s => s.hasPendingReview).length;
  const redFlagged = startups.filter(s => s.healthStatus === 'Red').length;
  const graduated = startups.filter(s => s.airlLevel >= 7).length;

  // --- CHART 1: PROGRESSION COMPARISON LOGIC ---
  const comparisonData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Initialize counts for levels 1-9
    const counts = Array.from({ length: 9 }, (_, i) => ({
      name: `${i + 1}`,
      startCount: 0,
      endCount: 0
    }));

    startups.forEach(startup => {
      const reviewDate = parseMockDate(startup.lastReviewDate);
      const currentLevel = startup.airlLevel;

      // Logic for "End Date" (Current Status at End Date)
      if (reviewDate <= end) {
        if (currentLevel >= 1 && currentLevel <= 9) {
          counts[currentLevel - 1].endCount++;
        }
      }

      // Logic for "Start Date" (Simulated Historical Status)
      if (reviewDate <= start) {
        if (currentLevel >= 1 && currentLevel <= 9) {
          counts[currentLevel - 1].startCount++;
        }
      } else if (reviewDate > start && reviewDate <= end) {
        // Assume they moved UP recently.
        const prevLevel = currentLevel - 1;
        if (prevLevel >= 1) {
          counts[prevLevel - 1].startCount++;
        }
      }
    });

    return counts;
  }, [startDate, endDate, startups]);

  // --- CHART 2: CURRENT SNAPSHOT ---
  const snapshotData = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const level = i + 1;
      return {
        name: `${level}`,
        count: startups.filter(s => s.airlLevel === level).length
      };
    });
  }, [startups]);

  const uniqueDomains = Array.from(new Set(startups.map(s => s.domain)));

  return (
    <DashboardLayout role="reviewer" title="Program & Innovation Dashboard">
      
      {/* 1. Top Task Bar */}
      <div className="bg-blue-900 text-white rounded-lg p-3 mb-8 shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="bg-blue-700 p-1.5 rounded-md animate-pulse">
            <Activity className="w-4 h-4 text-blue-200" />
          </div>
          <div className="flex space-x-6 text-sm font-medium">
            {urgentUpdates.map((update) => (
              <a key={update.id} href={update.link} className="flex items-center hover:text-blue-200 transition-colors">
                <span className="mr-2 opacity-70">[{update.time}]</span>
                {update.text}
              </a>
            ))}
          </div>
        </div>
        <Button 
          size="sm" 
          className="h-7 text-xs bg-blue text-blac border-none hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => navigate('/reviewer/tasks')} 
        >
          View All Tasks
        </Button>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card 
          className="border-l-4 border-l-blue-500 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigateToPortfolio('all', null)}
        >
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 font-medium">Total Startups</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{totalStartups}</h3>
              {/* Dynamic badge based on actual data changes in real app */}
              <Badge variant="success" className="mb-1">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card 
          className="border-l-4 border-l-yellow-500 cursor-pointer hover:bg-gray-50 transition-colors" 
          onClick={() => navigateToPortfolio('pending', true)}
        >
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 font-medium">Pending Reviews</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{pendingReviews}</h3>
              <span className="text-xs text-gray-400 mb-1">High Priority</span>
            </div>
          </CardContent>
        </Card>
        <Card 
          className="border-l-4 border-l-red-500 cursor-pointer hover:bg-gray-50 transition-colors" 
          onClick={() => navigateToPortfolio('status', 'Red')}
        >
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 font-medium">Red Flagged</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{redFlagged}</h3>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-red-600 hover:bg-red-100">View</Button>
            </div>
          </CardContent>
        </Card>
        <Card 
          className="border-l-4 border-l-green-500 cursor-pointer hover:bg-gray-50 transition-colors" 
          onClick={() => navigateToPortfolio('graduated', true)}
        >
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 font-medium">Graduated (AIRL 7+)</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{graduated}</h3>
              <TrendingUp className="w-5 h-5 text-green-500 mb-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* CHART 1: PROGRESSION COMPARISON */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Progression Comparison</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">Comparing AIRL distribution (Start vs End Date)</p>
                </div>
              </div>
              
              {/* Dual Date Pickers */}
              <div className="flex items-center justify-end gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Start</span>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-medium text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">End</span>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-medium text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  label={{ value: 'AIRL Level', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                />
                <Bar 
                  dataKey="startCount" 
                  name="Start Date" 
                  fill="#94a3b8" // Grey for historical
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                />
                <Bar 
                  dataKey="endCount" 
                  name="End Date" 
                  fill="#3b82f6" // Blue for current
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CHART 2: Current AIRL Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle>AIRL Progression Pipeline</CardTitle>
            <p className="text-xs text-gray-500 mt-1">Current status of all active startups (Including New)</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snapshotData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  label={{ value: 'Current AIRL Level', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#f3f4f6' }} 
                  labelFormatter={(label) => `AIRL Level ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  name="Startups" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(data) => navigateToPortfolio('airl', data.name)}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. Startup Health & Review Queue (Filtered Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Startup List */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-col space-y-4">
              <div className="flex flex-row items-center justify-between">
                <CardTitle>Portfolio Health Status</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search startups..." 
                      className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant={showFilters ? 'secondary' : 'outline'} 
                    size="sm" 
                    leftIcon={showFilters ? <X className="w-3 h-3"/> : <Filter className="w-3 h-3" />}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? 'Close' : 'Filter'}
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Domain</label>
                    <select 
                      className="w-full text-sm border-gray-200 rounded-md py-1.5 px-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      value={domainFilter}
                      onChange={(e) => setDomainFilter(e.target.value)}
                    >
                      <option value="all">All Domains</option>
                      {uniqueDomains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">AIRL Level</label>
                    <select 
                      className="w-full text-sm border-gray-200 rounded-md py-1.5 px-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      value={airlFilter}
                      onChange={(e) => setAirlFilter(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      {Array.from({length: 9}, (_, i) => i + 1).map(l => (
                        <option key={l} value={l}>Level {l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Health Status</label>
                    <select 
                      className="w-full text-sm border-gray-200 rounded-md py-1.5 px-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="Green">Green (Healthy)</option>
                      <option value="Yellow">Yellow (Warning)</option>
                      <option value="Red">Red (Critical)</option>
                    </select>
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Startup</th>
                    <th className="px-6 py-3">Domain</th>
                    <th className="px-6 py-3">Level</th>
                    <th className="px-6 py-3">RAG Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStartups.length > 0 ? (
                    filteredStartups.slice(0, 8).map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                        <td className="px-6 py-4 text-gray-500">{s.domain}</td>
                        <td className="px-6 py-4">
                          <Badge variant="neutral">AIRL {s.airlLevel}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            s.healthStatus === 'Green' ? 'bg-green-50 text-green-700 border-green-200' :
                            s.healthStatus === 'Yellow' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            <span className={`w-2 h-2 rounded-full mr-1.5 ${
                              s.healthStatus === 'Green' ? 'bg-green-500' :
                              s.healthStatus === 'Yellow' ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}></span>
                            {s.healthStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => navigate(`/reviewer/portfolio/${s.id}`)}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                        No startups match your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Review Queue */}
        <div>
          <Card className="h-full border-blue-100 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="w-5 h-5 mr-2 text-blue-600" />
                Your Review Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {startups.filter(s => s.hasPendingReview).slice(0, 2).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={task.isHighPriority ? 'danger' : 'info'}>
                      {task.isHighPriority ? 'High Priority' : 'Assessment'}
                    </Badge>
                    <span className="text-xs text-gray-400">Due Soon</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{task.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">AIRL {task.airlLevel} • {task.domain}</p>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                    </div>
                    <Button size="sm" className="h-7 text-xs">Start</Button>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <a href="/reviewer/calendar" className="text-xs text-blue-600 font-medium hover:underline">
                  View Full Calendar
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}