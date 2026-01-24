import React, { useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Download, Calendar, CheckCircle2, TrendingUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fundingSourcesDetailed } from '../../data/fundingData';

export function FundsReceived() {
  const navigate = useNavigate();

  // Flatten and filter history
  const receivedTransactions = useMemo(() => {
    return fundingSourcesDetailed.flatMap(source => 
      source.history
        .filter(item => item.status === 'Received')
        .map(item => ({
          ...item,
          sourceName: source.name,
          sourceShort: source.shortName,
          sourceColor: source.colorTheme,
          expiryDate: source.expiryDate
        }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const totalReceived = receivedTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRE = receivedTransactions.reduce((acc, curr) => acc + curr.reAmount, 0);
  const totalNRE = receivedTransactions.reduce((acc, curr) => acc + curr.nreAmount, 0);

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
              <h1 className="text-2xl font-bold text-slate-900">Funds Received History</h1>
              <p className="text-slate-500">Track of all capital inflows broken down by RE/NRE components.</p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-emerald-100 rounded-full text-emerald-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Funds In Bank</p>
                <h2 className="text-3xl font-bold text-slate-900">₹{totalReceived.toFixed(2)} Cr</h2>
              </div>
            </div>
            <div className="flex gap-8 text-right">
              <div>
                <p className="text-xs font-semibold text-emerald-800 uppercase">Recurring (RE)</p>
                <p className="text-xl font-bold text-emerald-600">₹{totalRE.toFixed(2)} Cr</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-800 uppercase">Non-Recurring (NRE)</p>
                <p className="text-xl font-bold text-blue-600">₹{totalNRE.toFixed(2)} Cr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Ledger</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date Received</th>
                    <th className="px-6 py-3 font-medium">Source</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium text-right">RE (Recurring)</th>
                    <th className="px-6 py-3 font-medium text-right">NRE (Capital)</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                    <th className="px-6 py-3 font-medium">Fund Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receivedTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {tx.date}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`bg-white font-normal
                          ${tx.sourceColor === 'blue' ? 'text-blue-700 border-blue-200' : 
                            tx.sourceColor === 'emerald' ? 'text-emerald-700 border-emerald-200' : 
                            'text-purple-700 border-purple-200'
                          }`}>
                          {tx.sourceShort}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-900 font-medium">{tx.description}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{tx.transactionRef}</p>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        ₹{tx.reAmount} Cr
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        ₹{tx.nreAmount} Cr
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        ₹{tx.amount} Cr
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center text-slate-600">
                           <Calendar className="w-3 h-3 mr-2 text-slate-400" />
                           {tx.expiryDate}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}