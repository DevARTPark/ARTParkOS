import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  Layout, 
  MoreHorizontal, 
  Search, 
  TrendingUp 
} from 'lucide-react';

// --- Mock Data ---

// 1. Ticker / Notifications
const urgentUpdates = [
  { id: 1, type: 'assessment', text: "GreenField Tech submitted TRL 3 Assessment", time: "2 hrs ago", link: "/reviewer/review/r1" },
  { id: 2, type: 'report', text: "MediDrone submitted Oct Monthly 1-Pager", time: "5 hrs ago", link: "/reviewer/review/r2" },
  { id: 3, type: 'alert', text: "AgriSense missed Q3 Goal: 'Pilot Deployment'", time: "1 day ago", link: "#" },
];

// 2. Stats
const domainData = [
  { name: 'Robotics', value: 35 },
  { name: 'AI/ML', value: 25 },
  { name: 'MedTech', value: 20 },
  { name: 'AgriTech', value: 10 },
  { name: 'CleanTech', value: 10 },
];

const airlDistribution = [
  { name: 'TRL 1-2', count: 5 },
  { name: 'TRL 3-4', count: 12 },
  { name: 'TRL 5-6', count: 8 },
  { name: 'TRL 7-9', count: 3 },
];

// 3. Startup List with R/Y/G Tags
const startupHealth = [
  { id: 's1', name: 'GreenField Tech', domain: 'AgriTech', trl: 3, status: 'Green', lastReview: 'Oct 15', trend: 'up' },
  { id: 's2', name: 'MediDrone', domain: 'MedTech', trl: 5, status: 'Yellow', lastReview: 'Sep 30', trend: 'flat' },
  { id: 's3', name: 'AutoBotics', domain: 'Robotics', trl: 2, status: 'Red', lastReview: 'Oct 01', trend: 'down' },
  { id: 's4', name: 'HealthAI', domain: 'AI/ML', trl: 4, status: 'Green', lastReview: 'Oct 10', trend: 'up' },
  { id: 's5', name: 'SolarFlow', domain: 'CleanTech', trl: 6, status: 'Yellow', lastReview: 'Sep 25', trend: 'flat' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export function ReviewerDashboard() {
  const [filter, setFilter] = useState('all');

  return (
    <DashboardLayout role="reviewer" title="Program & Innovation Dashboard">
      
      {/* 1. Top Task Bar (Live Updates) */}
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
        <Button size="sm" variant="secondary" className="h-7 text-xs bg-blue-700 text-white border-none hover:bg-blue-600">
          View All Tasks
        </Button>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 font-medium">Total Startups</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">28</h3>
              <Badge variant="success" className="mb-1">+2 this month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 font-medium">Pending Reviews</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">5</h3>
              <span className="text-xs text-gray-400 mb-1">3 High Priority</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 font-medium">Red Flagged</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">3</h3>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-red-600 hover:bg-red-50">View</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 font-medium">Graduated (TRL 7+)</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">8</h3>
              <TrendingUp className="w-5 h-5 text-green-500 mb-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Cohort Distribution (by Domain)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={domainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TRL Progression Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={airlDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. Startup Health & Review Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Detailed Startup List */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Portfolio Health Status</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm w-40" />
                </div>
                <Button variant="outline" size="sm" leftIcon={<Filter className="w-3 h-3" />}>Filter</Button>
              </div>
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
                  {startupHealth.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 text-gray-500">{s.domain}</td>
                      <td className="px-6 py-4">
                        <Badge variant="neutral">TRL {s.trl}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          s.status === 'Green' ? 'bg-green-50 text-green-700 border-green-200' :
                          s.status === 'Yellow' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${
                            s.status === 'Green' ? 'bg-green-500' :
                            s.status === 'Yellow' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}></span>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right: Assigned Task Queue */}
        <div>
          <Card className="h-full border-blue-100 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="w-5 h-5 mr-2 text-blue-600" />
                Your Review Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Task 1 */}
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer" 
                   onClick={() => window.location.href = '/reviewer/review/r1'}>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="info">Assessment</Badge>
                  <span className="text-xs text-gray-400">Due Today</span>
                </div>
                <h4 className="font-semibold text-gray-900">GreenField Tech</h4>
                <p className="text-xs text-gray-500 mb-3">TRL 3 Verification • Technology</p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                  </div>
                  <Button size="sm" className="h-7 text-xs">Start</Button>
                </div>
              </div>

              {/* Task 2 */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer opacity-75">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="warning">Monthly</Badge>
                  <span className="text-xs text-gray-400">Due Tomorrow</span>
                </div>
                <h4 className="font-semibold text-gray-900">MediDrone Systems</h4>
                <p className="text-xs text-gray-500 mb-3">October Progress Report Review</p>
                <div className="flex items-center justify-end border-t border-gray-50 pt-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
                </div>
              </div>

              {/* Empty State / Calendar Link */}
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