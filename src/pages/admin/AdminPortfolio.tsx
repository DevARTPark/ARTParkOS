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
  ArrowRight
} from 'lucide-react';
import { 
  FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// --- Mock Data ---

const activeCohort = [
  { id: 1, name: 'GreenField Tech', valuation: '₹45 Cr', revenue: '₹1.2 Cr', jobs: 24, AIRL: 3, sector: 'AgriTech' },
  { id: 2, name: 'MediDrone Systems', valuation: '₹120 Cr', revenue: '₹5.5 Cr', jobs: 45, AIRL: 5, sector: 'Healthcare' },
  { id: 3, name: 'AutoBotics', valuation: '₹22 Cr', revenue: '₹0.5 Cr', jobs: 12, AIRL: 2, sector: 'Robotics' },
  { id: 4, name: 'VisionAI', valuation: '₹60 Cr', revenue: '₹2.1 Cr', jobs: 18, AIRL: 4, sector: 'AI/ML' },
  { id: 5, name: 'SolarFlow', valuation: '₹35 Cr', revenue: '₹1.8 Cr', jobs: 15, AIRL: 6, sector: 'CleanTech' },
];

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

  return (
    <DashboardLayout role="admin" title="Portfolio Governance">
      
      {/* Top Header Controls */}
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
          {/* Summary Cards */}
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
                  <p className="text-xs text-green-600 font-medium uppercase">Total Revenue (ARR)</p>
                  <h3 className="text-xl font-bold text-green-900">₹11.1 Cr</h3>
                </div>
                <DollarSign className="w-8 h-8 text-green-300" />
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium uppercase">Jobs Created</p>
                  <h3 className="text-xl font-bold text-purple-900">114</h3>
                </div>
                <Users className="w-8 h-8 text-purple-300" />
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-medium uppercase">Avg AIRL</p>
                  <h3 className="text-xl font-bold text-orange-900">4.2</h3>
                </div>
                <Award className="w-8 h-8 text-orange-300" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Startup Name</th>
                    <th className="px-6 py-4 font-medium">Sector</th>
                    <th className="px-6 py-4 font-medium">Valuation</th>
                    <th className="px-6 py-4 font-medium">Revenue (ARR)</th>
                    <th className="px-6 py-4 font-medium">Jobs</th>
                    <th className="px-6 py-4 font-medium">Current AIRL</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeCohort.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4">
                        <Badge variant="neutral">{s.sector}</Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{s.valuation}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">{s.revenue}</td>
                      <td className="px-6 py-4 text-gray-600">{s.jobs}</td>
                      <td className="px-6 py-4">
                        <Badge variant="info">AIRL {s.airl}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="ghost">Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
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