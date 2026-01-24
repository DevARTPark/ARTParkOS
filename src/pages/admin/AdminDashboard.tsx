import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, 
  ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  Landmark,
  Wallet,
  ArrowRight,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';

// IMPORT MOCK DATA
import { adminStartups } from '../../data/adminMockData';
import { fundingSourcesDetailed } from '../../data/fundingData';

export function AdminDashboard() {
  const navigate = useNavigate();

  // --- STATE FOR DATE PICKERS (Chart 1) ---
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // --- REAL-TIME CALCULATIONS FROM DETAILED FUNDING DATA ---
  
  // 1. Sanctioned
  const totalSanctioned = fundingSourcesDetailed.reduce((acc, s) => acc + s.totalSanctioned, 0);
  const totalSanctionedRE = fundingSourcesDetailed.reduce((acc, s) => acc + s.sanctionedRE, 0);
  const totalSanctionedNRE = fundingSourcesDetailed.reduce((acc, s) => acc + s.sanctionedNRE, 0);

  // 2. Received
  const allReceivedTx = fundingSourcesDetailed.flatMap(s => s.history.filter(h => h.status === 'Received'));
  const totalReceived = allReceivedTx.reduce((acc, tx) => acc + tx.amount, 0);
  const totalReceivedRE = allReceivedTx.reduce((acc, tx) => acc + tx.reAmount, 0);
  const totalReceivedNRE = allReceivedTx.reduce((acc, tx) => acc + tx.nreAmount, 0);

  // 3. Allocated (Startups) - Assuming 70% RE / 30% NRE split for simulation if not in object
  const totalAllocated = adminStartups.reduce((acc, s) => acc + s.fundsAllocated, 0);
  const totalAllocatedRE = totalAllocated * 0.7; 
  const totalAllocatedNRE = totalAllocated * 0.3;

  // 4. Utilized
  const totalUtilized = adminStartups.reduce((acc, s) => acc + s.fundsUtilized, 0);
  
  // 5. Available (Received - Allocated)
  const bankBalance = totalReceived - totalAllocated;
  const availableRE = totalReceivedRE - totalAllocatedRE;
  const availableNRE = totalReceivedNRE - totalAllocatedNRE;

  // --- ALERTS ---
  const criticalStartups = adminStartups.filter(s => s.projects.some(p => p.status === 'Red') || s.runwayMonths < 3);
  const fundingRequests = adminStartups.filter(s => s.fundingRequest);

  // --- CHARTS ---
  const comparisonData = useMemo(() => {
    const counts = Array.from({ length: 9 }, (_, i) => ({ name: `${i + 1}`, startCount: 0, endCount: 0 }));
    adminStartups.forEach(s => {
      s.projects.forEach(p => {
        if (p.previousAIRL >= 1 && p.previousAIRL <= 9) counts[p.previousAIRL - 1].startCount++;
        if (p.currentAIRL >= 1 && p.currentAIRL <= 9) counts[p.currentAIRL - 1].endCount++;
      });
    });
    return counts;
  }, [adminStartups]);

  const snapshotData = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const level = i + 1;
      return {
        name: `${level}`,
        count: adminStartups.filter(s => s.projects.some(p => p.currentAIRL === level)).length
      };
    });
  }, [adminStartups]);

  return (
    <DashboardLayout role="admin" title="Executive Overview">
      
      {/* 1. THE COCKPIT: High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Total Budget Sanctioned */}
        <div 
          onClick={() => navigate('/admin/funding/total-sanctioned')} 
          className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <Card className="border-l-4 border-l-blue-600 bg-gradient-to-br from-white to-blue-50 h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Budget Sanctioned</p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-bold text-slate-900">₹{totalSanctioned}</h3>
                    <span className="text-sm font-medium text-slate-500">Cr</span>
                  </div>
                  <div className="mt-2 text-[10px] space-y-1">
                    <div className="flex items-center text-blue-700 font-medium">
                      <span className="w-6">RE:</span> 
                      <div className="w-16 h-1.5 bg-blue-200 rounded-full mx-1 overflow-hidden">
                        <div className="h-full bg-blue-600" style={{width: '100%'}}></div>
                      </div>
                      ₹{totalSanctionedRE} Cr
                    </div>
                    <div className="flex items-center text-slate-600">
                      <span className="w-6">NRE:</span> 
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-1 overflow-hidden">
                        <div className="h-full bg-slate-500" style={{width: '100%'}}></div>
                      </div>
                      ₹{totalSanctionedNRE} Cr
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <Landmark className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funds Received */}
        <div 
          onClick={() => navigate('/admin/funding/received')}
          className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50 h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Funds Received</p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-bold text-slate-900">₹{totalReceived}</h3>
                    <span className="text-sm font-medium text-slate-500">Cr</span>
                  </div>
                  <div className="mt-2 text-[10px] space-y-1">
                    <div className="flex items-center text-emerald-700 font-medium">
                      <span className="w-6">RE:</span> 
                      <div className="w-16 h-1.5 bg-emerald-200 rounded-full mx-1 overflow-hidden">
                        <div className="h-full bg-emerald-600" style={{width: '100%'}}></div>
                      </div>
                      ₹{totalReceivedRE} Cr
                    </div>
                    <div className="flex items-center text-slate-600">
                      <span className="w-6">NRE:</span> 
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-1 overflow-hidden">
                        <div className="h-full bg-slate-500" style={{width: '100%'}}></div>
                      </div>
                      ₹{totalReceivedNRE} Cr
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocated */}
        <div
          onClick={() => navigate('/admin/funding/allocated')}
          className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50 h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Allocated to Startups</p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-bold text-slate-900">₹{totalAllocated.toFixed(1)}</h3>
                    <span className="text-sm font-medium text-slate-500">Cr</span>
                  </div>
                  <div className="mt-2 text-[10px] space-y-1">
                    <div className="flex items-center text-purple-700 font-medium">
                      <span className="w-6">RE:</span> 
                      <div className="w-16 h-1.5 bg-purple-200 rounded-full mx-1 overflow-hidden">
                        <div className="h-full bg-purple-600" style={{width: '100%'}}></div>
                      </div>
                      ₹{totalAllocatedRE.toFixed(1)} Cr
                    </div>
                    <div className="flex items-center text-slate-600">
                      <span className="w-6">NRE:</span> 
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-1 overflow-hidden">
                        <div className="h-full bg-slate-500" style={{width: '100%'}}></div>
                      </div>
                      ₹{totalAllocatedNRE.toFixed(1)} Cr
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Balance */}
        <div 
          onClick={() => navigate('/admin/funding/available')}
          className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-white to-amber-50 h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Available (Unallocated)</p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-bold text-slate-900">₹{bankBalance.toFixed(1)}</h3>
                    <span className="text-sm font-medium text-slate-500">Cr</span>
                  </div>
                  <div className="mt-2 text-[10px] space-y-1">
                    <div className="flex items-center text-amber-700 font-medium">
                      <span className="w-6">RE:</span> 
                      <div className="w-16 h-1.5 bg-amber-200 rounded-full mx-1 overflow-hidden">
                        <div className="h-full bg-amber-600" style={{width: '100%'}}></div>
                      </div>
                      ₹{availableRE.toFixed(1)} Cr
                    </div>
                    <div className="flex items-center text-slate-600">
                      <span className="w-6">NRE:</span> 
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-1 overflow-hidden">
                        <div className="h-full bg-slate-500" style={{width: '100%'}}></div>
                      </div>
                      ₹{availableNRE.toFixed(1)} Cr
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. ALERTS & ACTION ITEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Urgent Funding Requests */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between text-amber-700">
              <span className="flex items-center"><DollarSign className="w-4 h-4 mr-2" /> Capital Requests</span>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">{fundingRequests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            {fundingRequests.map(s => (
              <div key={s.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-slate-800">{s.name}</h4>
                  <span className="font-bold text-amber-600 text-sm">{s.fundingRequest?.amount}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{s.fundingRequest?.reason}</p>
                <div className="mt-2 flex justify-end">
                   <span className="text-[10px] font-bold text-amber-700 flex items-center">
                     Review <ArrowRight className="w-3 h-3 ml-1" />
                   </span>
                </div>
              </div>
            ))}
            {fundingRequests.length === 0 && <p className="text-sm text-slate-400 italic p-2">No pending requests.</p>}
          </CardContent>
        </Card>

        {/* Critical Interventions */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" /> Critical Alerts & Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalStartups.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={s.logo} alt="" className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-medium text-slate-900">{s.name}</span>
                         {s.projects[0].status === 'Red' && (
                             <Badge variant="danger" className="text-[10px] px-1.5 py-0">Project Stalled</Badge>
                         )}
                      </div>
                      <span className="text-xs text-slate-500">Runway: <strong className="text-red-600">{s.runwayMonths} Months</strong> • Burn: ₹{s.burnRateMonthly}L/mo</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Schedule Meeting <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
              {criticalStartups.length === 0 && <p className="text-sm text-slate-500 italic">All systems green.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Progression Comparison</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Comparing AIRL distribution (Start vs End Date)</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Start</span>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none" />
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">End</span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} label={{ value: 'AIRL Level', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }} />
                <Bar dataKey="startCount" name="Start Date" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="endCount" name="End Date" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AIRL Progression Pipeline</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Current status of all active startups</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snapshotData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} label={{ value: 'Current AIRL Level', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: '#f3f4f6' }} labelFormatter={(label) => `AIRL Level ${label}`} />
                <Bar dataKey="count" name="Startups" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} className="cursor-pointer hover:opacity-80 transition-opacity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}