import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Calendar, Download, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fundingSourcesDetailed } from '../../data/fundingData';

export function TotalFundingSanctioned() {
  const navigate = useNavigate();

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
              <h1 className="text-2xl font-bold text-slate-900">Sanctioned Budget History</h1>
              <p className="text-slate-500">Detailed breakdown of funding sources, recurring (RE) vs non-recurring (NRE) splits.</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Download Report
          </Button>
        </div>

        {/* Source Cards Loop */}
        <div className="grid grid-cols-1 gap-8">
          {fundingSourcesDetailed.map((source) => (
            <Card key={source.id} className={`border-t-4 ${
              source.colorTheme === 'blue' ? 'border-t-blue-500' : 
              source.colorTheme === 'emerald' ? 'border-t-emerald-500' : 'border-t-purple-500'
            }`}>
              <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-sm ${
                        source.colorTheme === 'blue' ? 'bg-blue-600' : 
                        source.colorTheme === 'emerald' ? 'bg-emerald-600' : 'bg-purple-600'
                      }`}>
                        {source.shortName}
                      </div>
                      <div>
                        <CardTitle>{source.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-white text-slate-600 font-normal">
                            <Calendar className="w-3 h-3 mr-1" /> Expires: <span className="font-semibold text-slate-900 ml-1">{source.expiryDate}</span>
                          </Badge>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{source.description}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total Sanctioned</p>
                      <p className="text-3xl font-bold text-slate-900">₹{source.totalSanctioned} Cr</p>
                    </div>
                  </div>

                  {/* RE / NRE Split Bar */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-700">Recurring (RE): ₹{source.sanctionedRE} Cr</span>
                      <span className="font-semibold text-slate-700">Non-Recurring (NRE): ₹{source.sanctionedNRE} Cr</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
                      <div 
                        className={`h-full ${source.colorTheme === 'blue' ? 'bg-blue-500' : source.colorTheme === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'}`} 
                        style={{ width: `${(source.sanctionedRE / source.totalSanctioned) * 100}%` }}
                        title="Recurring"
                      ></div>
                      <div 
                        className={`h-full ${source.colorTheme === 'blue' ? 'bg-blue-200' : source.colorTheme === 'emerald' ? 'bg-emerald-200' : 'bg-purple-200'}`} 
                        style={{ width: `${(source.sanctionedNRE / source.totalSanctioned) * 100}%` }}
                        title="Non-Recurring"
                      ></div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Description</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">RE Amount</th>
                        <th className="px-6 py-3 font-medium text-right">NRE Amount</th>
                        <th className="px-6 py-3 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {source.history.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{item.date}</td>
                          <td className="px-6 py-4">
                            <p className="text-slate-900 font-medium">{item.description}</p>
                            <p className="text-xs text-slate-400 font-mono">{item.transactionRef}</p>
                          </td>
                          <td className="px-6 py-4">
                            {item.status === 'Received' ? (
                              <Badge className="bg-emerald-100 text-emerald-700 border-none hover:bg-emerald-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Received
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700 border-none hover:bg-amber-200">
                                <Clock className="w-3 h-3 mr-1" /> {item.status}
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-600">
                            {item.reAmount > 0 ? `₹${item.reAmount} Cr` : '-'}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-600">
                            {item.nreAmount > 0 ? `₹${item.nreAmount} Cr` : '-'}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">
                            ₹{item.amount} Cr
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/50 border-t border-slate-100">
                      <tr>
                        <td colSpan={3} className="px-6 py-3 text-right font-medium text-slate-500">Total Received So Far:</td>
                        <td colSpan={3} className="px-6 py-3 text-right font-bold text-emerald-600">
                          ₹{source.totalReceived} Cr
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert Footer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 text-sm">Budget Expiry Warning</h4>
            <p className="text-amber-700 text-sm mt-1">
              Please note that the <strong>DST Allocation</strong> is set to expire on <strong>March 31, 2025</strong>. 
              Ensure utilization certificates (UC) are submitted 30 days prior to this date.
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}