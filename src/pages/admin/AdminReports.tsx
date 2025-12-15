import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { 
  FileText, 
  Download, 
  Lightbulb, 
  Users, 
  Heart, 
  Briefcase,
  TrendingUp,
  Share2,
  Printer
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line 
} from 'recharts';

// --- Mock Data ---

// 1. Sector Analytics
const sectorPerformance = [
  { name: 'Robotics', revenue: 4.5, jobs: 120, ip: 8 },
  { name: 'AgriTech', revenue: 2.8, jobs: 85, ip: 5 },
  { name: 'MedTech', revenue: 6.2, jobs: 150, ip: 12 },
  { name: 'AI/ML', revenue: 3.5, jobs: 90, ip: 15 },
  { name: 'CleanTech', revenue: 1.2, jobs: 40, ip: 3 },
];

// 2. Impact Trends (Social)
const impactTrend = [
  { year: '2021', lives: 5000 },
  { year: '2022', lives: 25000 },
  { year: '2023', lives: 120000 },
  { year: '2024 (Proj)', lives: 500000 },
];

// 3. Downloadable Reports
const availableReports = [
  { id: 1, title: 'Annual Impact Report 2023', type: 'Public', date: 'Jan 15, 2024', size: '4.5 MB' },
  { id: 2, title: 'Q3 Govt. Compliance Summary', type: 'Confidential', date: 'Oct 10, 2023', size: '1.2 MB' },
  { id: 3, title: 'Portfolio IP & Patent Portfolio', type: 'Internal', date: 'Nov 01, 2023', size: '2.8 MB' },
  { id: 4, title: 'Job Creation & Economic Value', type: 'Public', date: 'Sep 20, 2023', size: '3.1 MB' },
];

export function AdminReports() {
  const [activeTab, setActiveTab] = useState('impact');

  return (
    <DashboardLayout role="admin" title="Impact & Reports">
      
      <Tabs 
        tabs={[
          { id: 'impact', label: 'Impact Metrics' },
          { id: 'sector', label: 'Sector Analytics' },
          { id: 'reports', label: 'Report Center' },
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        className="mb-6"
      />

      {/* --- Tab 1: Impact Metrics --- */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          
          {/* Hero Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-purple-700 uppercase tracking-wider">Intellectual Property</p>
                    <h3 className="text-4xl font-bold text-purple-900 mt-2">42</h3>
                    <p className="text-sm text-purple-600 mt-1">Patents Filed</p>
                  </div>
                  <div className="p-3 bg-white rounded-full text-purple-600 shadow-sm">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-100 flex justify-between text-xs font-medium text-purple-800">
                  <span>15 Granted</span>
                  <span>27 Pending</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-700 uppercase tracking-wider">Economic Impact</p>
                    <h3 className="text-4xl font-bold text-blue-900 mt-2">485</h3>
                    <p className="text-sm text-blue-600 mt-1">Direct Jobs Created</p>
                  </div>
                  <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm">
                    <Briefcase className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between text-xs font-medium text-blue-800">
                  <span>₹18.2 Cr Revenue Generated</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-rose-50 border-rose-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-rose-700 uppercase tracking-wider">Social Impact</p>
                    <h3 className="text-4xl font-bold text-rose-900 mt-2">1.2L+</h3>
                    <p className="text-sm text-rose-600 mt-1">Lives Touched</p>
                  </div>
                  <div className="p-3 bg-white rounded-full text-rose-600 shadow-sm">
                    <Heart className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-rose-100 flex justify-between text-xs font-medium text-rose-800">
                  <span>Primary Sector: Healthcare</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Impact Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Impact Growth (Lives Touched)</CardTitle>
                <p className="text-sm text-gray-500">Cumulative beneficiary count over years</p>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={impactTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="lives" stroke="#e11d48" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Creation Breakdown</CardTitle>
                <p className="text-sm text-gray-500">Employment generated per sector</p>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="jobs" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* --- Tab 2: Sector Analytics --- */}
      {activeTab === 'sector' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sector Performance Comparison</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Comparing Revenue (Cr), Jobs, and Innovation (IP) across domains</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="neutral">FY 2023-24</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue (Cr)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="jobs" name="Total Jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ip" name="Patents Filed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* --- Tab 3: Report Center --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Generate Custom Report</h3>
                <p className="text-slate-300 max-w-xl">
                  Select specific metrics, timeframes, and sectors to build a custom PDF report for Board Meetings or Government submissions.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" leftIcon={<Printer className="w-4 h-4" />}>Print Summary</Button>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 border-none" leftIcon={<FileText className="w-4 h-4" />}>
                  Create New Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Archive</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Report Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Generated Date</th>
                    <th className="px-6 py-4">File Size</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {availableReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                        <FileText className="w-4 h-4 text-red-500 mr-3" />
                        {report.title}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={report.type === 'Public' ? 'success' : report.type === 'Confidential' ? 'danger' : 'neutral'}>
                          {report.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{report.date}</td>
                      <td className="px-6 py-4 text-gray-500">{report.size}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Button size="sm" variant="ghost">Preview</Button>
                        <Button size="sm" variant="outline" leftIcon={<Download className="w-3 h-3" />}>
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

    </DashboardLayout>
  );
}