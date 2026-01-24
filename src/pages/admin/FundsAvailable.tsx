import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft, 
  Download, 
  Wallet, 
  Landmark, 
  TrendingDown, 
  CalendarClock,
  AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminStartups } from '../../data/adminMockData';
import { fundingSourcesDetailed } from '../../data/fundingData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export function FundsAvailable() {
  const navigate = useNavigate();

  // --- Financial Calculations ---
  // 1. Total Received (RE/NRE)
  const allReceived = fundingSourcesDetailed.flatMap(s => s.history.filter(h => h.status === 'Received'));
  const totalReceived = allReceived.reduce((acc, h) => acc + h.amount, 0);
  const totalReceivedRE = allReceived.reduce((acc, h) => acc + h.reAmount, 0);
  const totalReceivedNRE = allReceived.reduce((acc, h) => acc + h.nreAmount, 0);

  // 2. Total Utilized (Simplified: assuming startups use funds proportional to allocation)
  // In a real app, you'd track utilizedRE vs utilizedNRE per startup.
  // Here we use the 70/30 simulated split for utilization too.
  const totalUtilized = adminStartups.reduce((acc, s) => acc + s.fundsUtilized, 0);
  const totalUtilizedRE = totalUtilized * 0.7;
  const totalUtilizedNRE = totalUtilized * 0.3;

  // 3. Total Allocated
  const totalAllocated = adminStartups.reduce((acc, s) => acc + s.fundsAllocated, 0);
  const totalAllocatedRE = totalAllocated * 0.7;
  const totalAllocatedNRE = totalAllocated * 0.3;

  // 4. METRICS
  // Cash in Bank = Received - Utilized
  const cashInBank = totalReceived - totalUtilized;
  
  // Unallocated / Free Float = Received - Allocated
  const freeFloat = totalReceived - totalAllocated;
  const freeFloatRE = totalReceivedRE - totalAllocatedRE;
  const freeFloatNRE = totalReceivedNRE - totalAllocatedNRE;

  // --- Upcoming Inflows ---
  const upcomingInflows = fundingSourcesDetailed.flatMap(source => 
    source.history.filter(h => h.status === 'Scheduled' || h.status === 'Pending').map(h => ({
      ...h,
      source: source.shortName
    }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const liquidityData = [
    { name: 'Total Received', amount: totalReceived, color: '#10b981' }, 
    { name: 'Allocated', amount: totalAllocated, color: '#3b82f6' },
    { name: 'Spent', amount: totalUtilized, color: '#6366f1' },
    { name: 'Unallocated', amount: freeFloat, color: '#f59e0b' },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Treasury & Liquidity</h1>
              <p className="text-slate-500">Real-time view of RE/NRE cash position and unallocated float.</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Download Statement
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Cash Position */}
          <Card className="bg-gradient-to-br from-white to-emerald-50 border-emerald-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                  <Landmark className="w-6 h-6" />
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">
                  Liquid Asset
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Current Cash in Bank</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">₹{cashInBank.toFixed(2)} Cr</h3>
              <p className="text-xs text-slate-500 mt-2">
                Actual money available to disburse.
              </p>
            </CardContent>
          </Card>

          {/* 2. Unallocated RE */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <Wallet className="w-6 h-6" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                  Available RE
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Unallocated Recurring</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">₹{freeFloatRE.toFixed(2)} Cr</h3>
              <p className="text-xs text-slate-500 mt-2">
                Available for Ops/Salaries
              </p>
            </CardContent>
          </Card>

          {/* 3. Unallocated NRE */}
          <Card className="bg-gradient-to-br from-white to-amber-50 border-amber-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">
                  Available NRE
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Unallocated Capital</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">₹{freeFloatNRE.toFixed(2)} Cr</h3>
              <p className="text-xs text-slate-500 mt-2">
                Available for Infra/Equipment
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart: Liquidity Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Fund Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liquidityData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" unit=" Cr" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => `₹${Number(val).toFixed(2)} Cr`} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={30}>
                    {liquidityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upcoming Inflows & Expiry */}
          <Card>
            <CardHeader>
              <CardTitle>Projected Inflows & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Upcoming Tranches */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Scheduled Inflows</h4>
                  {upcomingInflows.length > 0 ? (
                    upcomingInflows.map((inflow, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded border border-slate-200 text-slate-500">
                            <CalendarClock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{inflow.description}</p>
                            <p className="text-xs text-slate-500">{inflow.date} • {inflow.source}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <span className="font-bold text-emerald-600 block">+ ₹{inflow.amount} Cr</span>
                           <span className="text-[10px] text-slate-400">
                             (RE: {inflow.reAmount} | NRE: {inflow.nreAmount})
                           </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No scheduled inflows.</p>
                  )}
                </div>

                {/* Expiry Warning */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Expiry Risks</h4>
                  {fundingSourcesDetailed.map(source => {
                    const daysLeft = Math.ceil((new Date(source.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    if (daysLeft > 180) return null; 

                    return (
                      <div key={source.id} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-amber-800">{source.name}</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Expires on <strong>{source.expiryDate}</strong> ({daysLeft} days remaining). 
                            Ensure utilization or file for extension.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}