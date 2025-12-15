import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TRLDistributionChart } from '../../components/charts/TRLDistributionChart';
import { startups } from '../../data/mockData';
import { 
  Filter, 
  Download, 
  MoreHorizontal, 
  TrendingUp, 
  DollarSign, 
  Activity,
  AlertTriangle,
  Zap,
  PieChart as PieIcon,
  ArrowUpRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- Mock Data for Admin Cockpit ---
const cockpitData = {
  valuation: '₹450 Cr',
  valuationGrowth: '+12%',
  fundsDeployed: '₹42 Cr',
  fundsTotal: '₹100 Cr',
  leverageRatio: '1 : 5.2', // ₹1 grant = ₹5.2 VC money
};

const domainData = [
  { name: 'Robotics', value: 45 },
  { name: 'Healthcare', value: 30 },
  { name: 'AgriTech', value: 25 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const alerts = [
  { id: 1, type: 'critical', text: "3 Startups have <2 months runway", action: "Review Financials" },
  { id: 2, type: 'info', text: "MediDrone filed 'Autonomous Navigation' Patent", action: "View IP" },
  { id: 3, type: 'warning', text: "Q3 Utilization Certificates pending for 5 startups", action: "Send Reminder" },
];

const healthMatrix = [
  // Green (On Track)
  ...Array(12).fill('green'),
  // Yellow (At Risk)
  ...Array(6).fill('yellow'),
  // Red (Critical)
  ...Array(3).fill('red'),
];

export function AdminDashboard() {
  return (
    <DashboardLayout role="admin" title="Executive Overview">
      
      {/* 1. THE COCKPIT: High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Valuation */}
        <Card className="border-l-4 border-l-blue-600 bg-gradient-to-br from-white to-blue-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Portfolio Valuation</p>
                <h3 className="text-3xl font-bold text-slate-900">{cockpitData.valuation}</h3>
                <span className="text-xs font-medium text-green-600 flex items-center mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" /> {cockpitData.valuationGrowth} vs last quarter
                </span>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funds Deployed */}
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Funds Deployed vs Corpus</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-slate-900">{cockpitData.fundsDeployed}</h3>
                  <span className="text-sm text-slate-400">/ {cockpitData.fundsTotal}</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-1.5 mt-3">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leverage Ratio */}
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">External Leverage Ratio</p>
                <h3 className="text-3xl font-bold text-slate-900">{cockpitData.leverageRatio}</h3>
                <p className="text-xs text-slate-500 mt-2">
                  For every ₹1 grant, startups raised <strong>₹5.2</strong> VC funding.
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Health & Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Health Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between">
              Cohort Health Matrix
              <div className="flex gap-2">
                <span className="flex items-center text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>On Track</span>
                <span className="flex items-center text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>Risk</span>
                <span className="flex items-center text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Critical</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {healthMatrix.map((status, idx) => (
                <div 
                  key={idx} 
                  className={`w-8 h-8 rounded-md transition-all hover:scale-110 cursor-pointer ${
                    status === 'green' ? 'bg-green-500' : status === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  title={`Startup Status: ${status}`}
                ></div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">Each block represents one active startup in the portfolio.</p>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" /> Critical Alerts & Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.type === 'critical' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm font-medium text-slate-700">{alert.text}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    {alert.action} <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Existing Visuals (Context) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>TRL Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TRLDistributionChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={domainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {domainData.map((d, i) => (
                <div key={i} className="flex items-center text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[i] }}></div>
                  {d.name} ({d.value}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Portfolio Table (Detailed View) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portfolio Snapshot</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
              Filters
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Startup</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Domain</th>
                  <th className="px-6 py-3">Current TRL</th>
                  <th className="px-6 py-3">Weakest Param</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {startups.map(startup => (
                  <tr key={startup.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center space-x-3">
                      <img src={startup.logo} alt="" className="w-8 h-8 rounded-full" />
                      <span>{startup.name}</span>
                    </td>
                    <td className="px-6 py-4">{startup.projects[0].name}</td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral">
                        {startup.projects[0].domain}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">
                      TRL {startup.projects[0].currentTRL}
                    </td>
                    <td className="px-6 py-4 text-red-500">Market Research</td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}