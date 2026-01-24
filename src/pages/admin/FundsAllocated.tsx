import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  ArrowLeft, 
  Download, 
  Search, 
  PieChart as PieIcon, 
  TrendingUp, 
  AlertCircle, 
  MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminStartups } from '../../data/adminMockData';

export function FundsAllocated() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // --- Aggregate Metrics ---
  const totalAllocated = adminStartups.reduce((acc, s) => acc + s.fundsAllocated, 0);
  const totalUtilized = adminStartups.reduce((acc, s) => acc + s.fundsUtilized, 0);
  const utilizationRate = (totalUtilized / totalAllocated) * 100;

  // Simulate RE/NRE Split (70/30) for aggregate
  const totalAllocatedRE = totalAllocated * 0.7;
  const totalAllocatedNRE = totalAllocated * 0.3;

  const filteredStartups = adminStartups.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold text-slate-900">Portfolio Allocation</h1>
              <p className="text-slate-500">Track fund usage and RE/NRE splits across {adminStartups.length} startups.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Download Report
            </Button>
          </div>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Allocated</p>
                  <h3 className="text-2xl font-bold text-slate-900">₹{totalAllocated.toFixed(2)} Cr</h3>
                  <div className="flex text-xs mt-2 gap-3">
                    <span className="text-purple-700">RE: ₹{totalAllocatedRE.toFixed(1)}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-blue-700">NRE: ₹{totalAllocatedNRE.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <PieIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Utilized</p>
                  <h3 className="text-2xl font-bold text-slate-900">₹{totalUtilized.toFixed(2)} Cr</h3>
                  <p className="text-xs text-slate-400 mt-1">{utilizationRate.toFixed(1)}% of allocated</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-amber-500">
             <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Funding Requests</p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {adminStartups.filter(s => s.fundingRequest).length}
                  </h3>
                  <p className="text-xs text-amber-600 mt-1 font-medium">Requires Attention</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100">
            <CardTitle>Startup Allocation Ledger</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search startups..." 
                className="pl-9 h-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Startup</th>
                    <th className="px-6 py-3 font-medium">Total Allocated</th>
                    <th className="px-6 py-3 font-medium">RE Split (70%)</th>
                    <th className="px-6 py-3 font-medium">NRE Split (30%)</th>
                    <th className="px-6 py-3 font-medium">Utilized</th>
                    <th className="px-6 py-3 font-medium">Remaining</th>
                    <th className="px-6 py-3 font-medium">Runway</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStartups.map((startup) => {
                    const pctUtilized = (startup.fundsUtilized / startup.fundsAllocated) * 100;
                    const remaining = startup.fundsAllocated - startup.fundsUtilized;
                    const reSplit = (startup.fundsAllocated * 0.7).toFixed(2);
                    const nreSplit = (startup.fundsAllocated * 0.3).toFixed(2);
                    
                    return (
                      <tr key={startup.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={startup.logo} alt="" className="w-9 h-9 rounded-lg border border-slate-200" />
                            <div>
                              <p className="font-semibold text-slate-900">{startup.name}</p>
                              {startup.fundingRequest && (
                                <span className="text-[10px] flex items-center text-amber-600 font-bold mt-0.5">
                                  Asking: {startup.fundingRequest.amount}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          ₹{startup.fundsAllocated} Cr
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          ₹{reSplit} Cr
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          ₹{nreSplit} Cr
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full max-w-[100px]">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-slate-700">₹{startup.fundsUtilized}</span>
                              <span className="text-slate-500">{pctUtilized.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${pctUtilized > 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                style={{ width: `${pctUtilized}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          ₹{remaining.toFixed(2)} Cr
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`border-none ${
                            startup.runwayMonths < 4 
                              ? 'bg-red-100 text-red-700' 
                              : startup.runwayMonths < 8 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {startup.runwayMonths} Months
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}