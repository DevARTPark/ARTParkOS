import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  Search,
  Filter,
  Link,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- Mock Data ---

const grantBurnData = [
  { month: 'Jan', deployed: 45, utilization: 40 },
  { month: 'Feb', deployed: 48, utilization: 46 },
  { month: 'Mar', deployed: 55, utilization: 52 },
  { month: 'Apr', deployed: 60, utilization: 58 },
  { month: 'May', deployed: 65, utilization: 64 },
  { month: 'Jun', deployed: 72, utilization: 70 },
];

const disbursements = [
  { 
    id: 1, 
    startup: 'GreenField Tech', 
    totalGrant: '₹50L', 
    disbursed: '₹20L (40%)', 
    currentTranche: 'Tranche 2', 
    status: 'Pending UC', 
    action: 'Review UC',
    burnRate: 'Low' 
  },
  { 
    id: 2, 
    startup: 'MediDrone Systems', 
    totalGrant: '₹75L', 
    disbursed: '₹50L (66%)', 
    currentTranche: 'Tranche 3', 
    status: 'Eligible', 
    action: 'Approve Release',
    burnRate: 'High' 
  },
  { 
    id: 3, 
    startup: 'AutoBotics', 
    totalGrant: '₹30L', 
    disbursed: '₹30L (100%)', 
    currentTranche: 'Final', 
    status: 'Completed', 
    action: 'View Report',
    burnRate: 'Medium' 
  },
];

const investors = [
  { 
    id: 'inv1', 
    name: 'OmniVerse Ventures', 
    type: 'VC Fund', 
    focus: ['Robotics', 'DeepTech'], 
    ticketSize: '₹2Cr - ₹10Cr',
    contact: 'partners@omniverse.vc',
    matches: ['AutoBotics', 'VisionAI']
  },
  { 
    id: 'inv2', 
    name: 'GreenEarth Angels', 
    type: 'Angel Network', 
    focus: ['AgriTech', 'CleanTech'], 
    ticketSize: '₹50L - ₹2Cr',
    contact: 'dealflow@greenearth.com',
    matches: ['GreenField Tech', 'SolarFlow']
  },
  { 
    id: 'inv3', 
    name: 'HealthX Capital', 
    type: 'Corporate VC', 
    focus: ['MedTech', 'Healthcare'], 
    ticketSize: '₹5Cr+',
    contact: 'invest@healthx.com',
    matches: ['MediDrone Systems']
  },
];

export function AdminFinancials() {
  const [activeTab, setActiveTab] = useState('grants');

  return (
    <DashboardLayout role="admin" title="Financial Governance">
      
      <Tabs 
        tabs={[
          { id: 'grants', label: 'Grant Management' },
          { id: 'investors', label: 'VC & Investor Connect' },
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        className="mb-6"
      />

      {/* --- Tab 1: Grants & Burn Rate --- */}
      {activeTab === 'grants' && (
        <div className="space-y-6">
          
          {/* Burn Rate Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Ecosystem Capital Deployment</CardTitle>
                <p className="text-sm text-gray-500">Cumulative Grants Deployed vs. Utilized by Startups</p>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={grantBurnData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDeployed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="deployed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDeployed)" name="Deployed (Cr)" />
                    <Area type="monotone" dataKey="utilization" stroke="#10b981" fillOpacity={1} fill="url(#colorUtil)" name="Utilized (Cr)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-blue-700 mb-1">Monthly Ecosystem Burn</p>
                  <h3 className="text-3xl font-bold text-blue-900">₹3.2 Cr</h3>
                  <div className="flex items-center mt-2 text-xs text-blue-600">
                    <TrendingUp className="w-3 h-3 mr-1" /> +8% vs last month
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-100">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-amber-700 mb-1">Startups with &lt;3m Runway</p>
                  <h3 className="text-3xl font-bold text-amber-900">4</h3>
                  <Button variant="ghost" size="sm" className="mt-2 h-6 px-0 text-amber-700 hover:bg-amber-100 hover:text-amber-900">
                    View List <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Grant Tranches Table */}
          <Card>
            <CardHeader>
              <CardTitle>Grant Disbursement Tracker</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Startup</th>
                    <th className="px-6 py-4">Total Grant</th>
                    <th className="px-6 py-4">Disbursed</th>
                    <th className="px-6 py-4">Next Tranche</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {disbursements.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{d.startup}</td>
                      <td className="px-6 py-4">{d.totalGrant}</td>
                      <td className="px-6 py-4 text-gray-600">{d.disbursed}</td>
                      <td className="px-6 py-4">{d.currentTranche}</td>
                      <td className="px-6 py-4">
                        <Badge variant={d.status === 'Eligible' ? 'success' : d.status === 'Completed' ? 'neutral' : 'warning'}>
                          {d.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant={d.status === 'Eligible' ? 'primary' : 'outline'}>
                          {d.action}
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

      {/* --- Tab 2: VC & Investor Connect --- */}
      {activeTab === 'investors' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search Investors by name or sector..." 
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button leftIcon={<Filter className="w-4 h-4" />} variant="outline">Filters</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {investors.map((inv) => (
              <Card key={inv.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{inv.name}</CardTitle>
                      <p className="text-xs text-gray-500 mt-1">{inv.type}</p>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Focus Areas</p>
                      <div className="flex gap-2 flex-wrap">
                        {inv.focus.map(f => (
                          <Badge key={f} variant="info">{f}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ticket Size</span>
                      <span className="font-medium text-gray-900">{inv.ticketSize}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                      <Link className="w-3 h-3 mr-1" /> Top Matches
                    </p>
                    <div className="space-y-2">
                      {inv.matches.map(m => (
                        <div key={m} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-700">{m}</span>
                          <Button size="sm" variant="ghost" className="h-6 text-xs text-blue-600 hover:text-blue-700">Connect</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}