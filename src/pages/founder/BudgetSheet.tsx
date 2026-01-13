import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Upload, PieChart, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface BudgetSheetProps {
  data: Array<{
    month: string;
    status: string;
    dstRE: number;
    dstNRE: number;
    gokRE: number;
    gokNRE: number;
    totalDST: number;
    totalGoK: number;
    total: number;
  }>;
  budgetLimits: {
    DST: number;
    GoK: number;
  };
}

export function BudgetSheet({ data, budgetLimits }: BudgetSheetProps) {
  
  const cumulative = data.reduce((acc, curr) => ({
    dst: acc.dst + curr.totalDST,
    gok: acc.gok + curr.totalGoK,
    total: acc.total + curr.total
  }), { dst: 0, gok: 0, total: 0 });

  const remainingDST = budgetLimits.DST - cumulative.dst;
  const remainingGoK = budgetLimits.GoK - cumulative.gok;

  const chartData = [...data].reverse(); 

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DST Stats */}
        <Card className="border-l-4 border-l-blue-600 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">DST (Dept Science & Tech)</p>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-blue-900">₹{cumulative.dst.toFixed(2)}</span>
                  <span className="text-xs text-blue-600"> / {budgetLimits.DST} Lakhs</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((cumulative.dst / budgetLimits.DST) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-blue-600 mt-1">
                  {remainingDST >= 0 ? `₹${remainingDST.toFixed(2)} Remaining` : `Overbudget by ₹${Math.abs(remainingDST).toFixed(2)}`}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-300" />
            </div>
          </CardContent>
        </Card>

        {/* GoK Stats */}
        <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-orange-800 uppercase tracking-wider">GoK (Govt Karnataka)</p>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-orange-900">₹{cumulative.gok.toFixed(2)}</span>
                  <span className="text-xs text-orange-600"> / {budgetLimits.GoK} Lakhs</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-1.5 mt-2">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${remainingGoK < 0 ? 'bg-red-500' : 'bg-orange-500'}`}
                    style={{ width: `${Math.min((cumulative.gok / budgetLimits.GoK) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-orange-600 mt-1">
                  {remainingGoK >= 0 ? `₹${remainingGoK.toFixed(2)} Remaining` : `Overbudget by ₹${Math.abs(remainingGoK).toFixed(2)}`}
                </p>
              </div>
              <PieChart className="w-6 h-6 text-orange-300" />
            </div>
          </CardContent>
        </Card>

        {/* Total Utilization */}
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/50">
          <CardContent className="p-4 flex flex-col justify-center h-full">
             <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-medium text-emerald-800">Total Utilization</span>
               <Badge variant="success">{(cumulative.total / (budgetLimits.DST + budgetLimits.GoK) * 100).toFixed(1)}%</Badge>
             </div>
             <p className="text-3xl font-bold text-emerald-900">₹{cumulative.total.toFixed(2)}</p>
             <p className="text-xs text-emerald-600">Total spent across all sources</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold text-gray-800">
              Monthly Expenditure Breakdown (Actuals)
            </CardTitle>
            <p className="text-xs text-gray-500">Breakdown by Source (DST/GoK) and Expense Type (RE/NRE)</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Upload className="w-4 h-4 rotate-180" />}
          >
            Export PDF
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 text-left bg-gray-50 border-r border-gray-200">Month</th>
                  <th colSpan={2} className="px-4 py-2 border-b border-gray-200 text-blue-700 bg-blue-50">DST (Govt India)</th>
                  <th colSpan={2} className="px-4 py-2 border-b border-gray-200 text-orange-700 bg-orange-50">GoK (Karnataka)</th>
                  <th rowSpan={2} className="px-4 py-3 text-right bg-gray-50 border-l border-gray-200">Total</th>
                  <th rowSpan={2} className="px-4 py-3 bg-gray-50">Status</th>
                </tr>
                <tr>
                  <th className="px-2 py-2 text-xs text-blue-600 bg-blue-50/50 border-r border-blue-100">RE</th>
                  <th className="px-2 py-2 text-xs text-blue-600 bg-blue-50/50 border-r border-gray-200">NRE</th>
                  <th className="px-2 py-2 text-xs text-orange-600 bg-orange-50/50 border-r border-orange-100">RE</th>
                  <th className="px-2 py-2 text-xs text-orange-600 bg-orange-50/50">NRE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-left font-medium text-gray-900 border-r border-gray-100">
                      {row.month}
                    </td>
                    <td className="px-2 py-3 text-gray-600 border-r border-gray-100">
                        {row.dstRE > 0 ? `₹${row.dstRE}` : '-'}
                    </td>
                    <td className="px-2 py-3 text-gray-600 border-r border-gray-200 bg-gray-50/30">
                        {row.dstNRE > 0 ? `₹${row.dstNRE}` : '-'}
                    </td>
                    <td className="px-2 py-3 text-gray-600 border-r border-gray-100">
                        {row.gokRE > 0 ? `₹${row.gokRE}` : '-'}
                    </td>
                    <td className="px-2 py-3 text-gray-600 bg-gray-50/30">
                        {row.gokNRE > 0 ? `₹${row.gokNRE}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 border-l border-gray-200">
                      ₹{row.total}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          row.status === "Submitted"
                            ? "success"
                            : row.status === "Pending"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monthly Expenditure Source Split</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Legend />
              <Bar dataKey="dstRE" name="DST (Recurring)" stackId="dst" fill="#93c5fd" />
              <Bar dataKey="dstNRE" name="DST (Non-Recurring)" stackId="dst" fill="#2563eb" />
              <Bar dataKey="gokRE" name="GoK (Recurring)" stackId="gok" fill="#fdba74" />
              <Bar dataKey="gokNRE" name="GoK (Non-Recurring)" stackId="gok" fill="#ea580c" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}