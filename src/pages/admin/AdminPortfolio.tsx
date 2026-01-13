import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Clock
} from 'lucide-react';
import { 
  FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer 
} from 'recharts';

// IMPORT MOCK DATA (Real-time data for Active Cohort)
import { adminStartups } from '../../data/adminMockData';

// --- Local Mock Data for Other Tabs ---
const dealFlowData = [
  { value: 120, name: 'Applications', fill: '#3b82f6' },
  { value: 45, name: 'Screening', fill: '#6366f1' },
  { value: 12, name: 'Due Diligence', fill: '#8b5cf6' },
  { value: 5, name: 'IC Approval', fill: '#ec4899' },
  { value: 2, name: 'Incubated', fill: '#10b981' },
];

const alumniData = [
  { id: 101, name: 'RoboClean', exitDate: '2021', status: 'Acquired', acquirer: 'Tata Electronics', valuationAtExit: '₹250 Cr' },
  { id: 102, name: 'AgriNext', exitDate: '2022', status: 'Profitable', acquirer: '-', valuationAtExit: '₹180 Cr' },
  { id: 103, name: 'HealthBridge', exitDate: '2023', status: 'Series B', acquirer: '-', valuationAtExit: '₹400 Cr' },
];

export function AdminPortfolio() {
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filter Logic for Active Cohort (Using adminMockData)
  const filteredStartups = adminStartups.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.projects[0].domain.toLowerCase().includes(search.toLowerCase());
    
    if (filterStatus === 'All') return matchesSearch;
    return matchesSearch && s.projects[0].status === filterStatus;
  });

  return (
    <DashboardLayout role="admin" title="Portfolio Governance">
      
      {/* Top Header Controls (Tabs & Global Actions) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Tabs 
          tabs={[
            { id: 'active', label: 'Active Cohort' },
            { id: 'dealflow', label: 'Deal Flow & Pipeline' },
            { id: 'alumni', label: 'Graduation & Alumni' },
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        {/* Search is shared across tabs visually, but logic currently applies to Active */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search startup..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Report
          </Button>
        </div>
      </div>

      {/* --- Tab 1: Active Cohort --- */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          
          {/* 1. Summary Cards (Aggregated Stats) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium uppercase">Total Valuation</p>
                  <h3 className="text-xl font-bold text-blue-900">₹282 Cr</h3>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-300" />
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium uppercase">Funds Deployed</p>
                  {/* Dynamically calculated from adminStartups */}
                  <h3 className="text-xl font-bold text-green-900">
                    ₹{adminStartups.reduce((acc, s) => acc + s.fundsAllocated, 0).toFixed(1)} Cr
                  </h3>
                </div>
                <DollarSign className="w-8 h-8 text-green-300" />
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium uppercase">Active Startups</p>
                  <h3 className="text-xl font-bold text-purple-900">{adminStartups.length}</h3>
                </div>
                <Users className="w-8 h-8 text-purple-300" />
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-medium uppercase">Avg AIRL</p>
                  <h3 className="text-xl font-bold text-orange-900">
                    {(adminStartups.reduce((acc, s) => acc + s.projects[0].currentAIRL, 0) / adminStartups.length).toFixed(1)}
                  </h3>
                </div>
                <Award className="w-8 h-8 text-orange-300" />
              </CardContent>
            </Card>
          </div>

          {/* 2. Controls & Filter Bar */}
          <div className="flex gap-2">
             {['All', 'Green', 'Yellow', 'Red'].map(status => (
               <button
                 key={status}
                 onClick={() => setFilterStatus(status)}
                 className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                   filterStatus === status 
                     ? 'bg-blue-600 text-white shadow-md' 
                     : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                 }`}
               >
                 {status}
               </button>
             ))}
          </div>

          {/* 3. Portfolio Grid (Detailed Cards) */}
          <div className="grid grid-cols-1 gap-6">
            {filteredStartups.map((startup) => {
              const project = startup.projects[0];
              const percentUtilized = (startup.fundsUtilized / startup.fundsAllocated) * 100;
              
              return (
                <Card key={startup.id} className="hover:shadow-md transition-shadow border-l-4" style={{
                  borderLeftColor: project.status === 'Green' ? '#10b981' : project.status === 'Yellow' ? '#f59e0b' : '#ef4444'
                }}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* A. Identity & Core Info */}
                      <div className="flex-1 min-w-[250px]">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={startup.logo} alt={startup.name} className="w-12 h-12 rounded-lg shadow-sm" />
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{startup.name}</h3>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>{startup.location}</span>
                              <span>•</span>
                              <span>Est. {startup.foundedYear}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{startup.description}</p>
                        <div className="flex gap-2">
                          <Badge variant="neutral">{project.domain}</Badge>
                          {startup.fundingRequest && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                              Funds Requested
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* B. Financial Health Stats */}
                      <div className="flex-1 min-w-[200px] border-l border-gray-100 lg:pl-6 lg:border-l lg:border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Financials (INR Cr)</h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div>
                            <p className="text-xs text-gray-500">Allocated</p>
                            <p className="text-lg font-bold text-gray-900">₹{startup.fundsAllocated.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Utilized</p>
                            <p className={`text-lg font-bold ${percentUtilized > 90 ? 'text-red-600' : 'text-gray-900'}`}>
                              ₹{startup.fundsUtilized.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Burn Rate</p>
                            <p className="text-sm font-semibold text-gray-700">₹{startup.burnRateMonthly} L/mo</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Runway</p>
                            <p className={`text-sm font-bold ${startup.runwayMonths < 4 ? 'text-red-600' : 'text-green-600'}`}>
                              {startup.runwayMonths} Months
                            </p>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                          <div 
                            className={`h-1.5 rounded-full ${percentUtilized > 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
                            style={{ width: `${Math.min(percentUtilized, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* C. Project & Review Status */}
                      <div className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">{project.name}</h4>
                            <p className="text-xs text-gray-500">Primary Project</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold text-blue-600">L{project.currentAIRL}</span>
                            <span className="text-[10px] text-gray-400">AIRL Level</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-600 italic bg-white p-2 rounded border border-gray-100">
                          "{startup.reviewerComment}"
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> Reviewed: {startup.lastReviewDate}
                          </span>
                          <a href="#" className="text-xs text-blue-600 font-medium hover:underline flex items-center">
                            Full Report <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Tab 2: Deal Flow --- */}
      {activeTab === 'dealflow' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funnel Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Application Pipeline (Current Quarter)</CardTitle>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <ResponsiveContainer width="80%" height="100%">
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    data={dealFlowData}
                    dataKey="value"
                  >
                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                    <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={16} fontWeight="bold" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Action List */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Board Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="warning">Due Diligence</Badge>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
                <h4 className="font-bold text-gray-900">NeuroTech Solutions</h4>
                <p className="text-sm text-gray-500 mb-3">Brain-computer interface for assistive tech.</p>
                <Button className="w-full" size="sm">Review File</Button>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="warning">IC Approval</Badge>
                  <span className="text-xs text-gray-400">5 days ago</span>
                </div>
                <h4 className="font-bold text-gray-900">SkyFarm Drones</h4>
                <p className="text-sm text-gray-500 mb-3">Heavy payload drones for crop spraying.</p>
                <Button className="w-full" size="sm">Approve Incubation</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Tab 3: Graduation & Alumni --- */}
      {activeTab === 'alumni' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-500" /> Hall of Fame (AIRL 7+)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Startup</th>
                  <th className="px-6 py-4">Exit / Grad Date</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4">Acquirer / Investor</th>
                  <th className="px-6 py-4">Valuation at Exit</th>
                  <th className="px-6 py-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alumniData.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 text-gray-500">{s.exitDate}</td>
                    <td className="px-6 py-4">
                      <Badge variant={s.status === 'Acquired' ? 'success' : 'info'}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{s.acquirer}</td>
                    <td className="px-6 py-4 font-mono font-medium">{s.valuationAtExit}</td>
                    <td className="px-6 py-4 text-right">
                      <a href="#" className="text-blue-600 hover:underline flex items-center justify-end">
                        View <ArrowRight className="w-3 h-3 ml-1" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

    </DashboardLayout>
  );
}