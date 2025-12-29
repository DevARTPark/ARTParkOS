import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { DollarSign, Upload, PieChart } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

// Import Shared Constants
import { PROJECT_COLORS } from "./FounderReviews";

interface BudgetSheetProps {
  data: Array<{
    month: string;
    status: string;
    totalRE: number;
    totalNRE: number;
    total: number;
    breakdown: Array<{ name: string; total: number }>;
  }>;
  projectExpenses: Array<{ name: string; value: number }>;
}

export function BudgetSheet({ data, projectExpenses }: BudgetSheetProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* 1. TABLE (TOP) */}
      <Card className="border-t-4 border-t-emerald-500">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-emerald-900">
              <DollarSign className="w-5 h-5 mr-2" /> Monthly Budget Sheet
            </CardTitle>
            <p className="text-xs text-emerald-600 mt-1">
              Consolidated view of RE & NRE expenses across Startup Level & Projects.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Upload className="w-4 h-4 rotate-180" />}
          >
            Export Sheet
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Month</th>
                  <th className="px-4 py-3 text-left">Breakdown</th>
                  <th className="px-4 py-3 text-right text-indigo-600">
                    Recurring (RE)
                  </th>
                  <th className="px-4 py-3 text-right text-orange-600">
                    Non-Recurring (NRE)
                  </th>
                  <th className="px-4 py-3 text-right text-gray-900">
                    Total Spent
                  </th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-4 py-4 font-bold text-gray-800">
                      {row.month}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {row.breakdown.map((b, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs text-gray-500 w-full max-w-[200px]"
                          >
                            <span
                              className={
                                b.name === "Startup Level"
                                  ? "font-bold text-indigo-900"
                                  : ""
                              }
                            >
                              {b.name}:
                            </span>
                            <span>₹{b.total}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-indigo-600">
                      ₹{row.totalRE}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-orange-600">
                      ₹{row.totalNRE}
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-bold text-gray-900">
                      ₹{row.total}
                    </td>
                    <td className="px-4 py-4 text-center">
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

      {/* 2. GRAPHS (MIDDLE ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GRAPH 1: RE vs NRE Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Expense Trend (RE vs NRE)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {/* Use a copy for reversing to avoid mutating the memoized data if it were passed directly, though slice() is safe */}
              <BarChart data={[...data].reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalRE"
                  name="Recurring"
                  stackId="a"
                  fill="#4f46e5"
                />
                <Bar
                  dataKey="totalNRE"
                  name="Non-Recurring"
                  stackId="a"
                  fill="#f97316"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GRAPH 2: Project Wise Spend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Project-wise Spending (Total)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectExpenses}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <Tooltip
                  formatter={(value) => `₹${value}`}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="value"
                  name="Total Spend"
                  barSize={20}
                  radius={[0, 4, 4, 0]}
                >
                  {projectExpenses.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PROJECT_COLORS[index % PROJECT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. BUDGET UTILIZATION (BOTTOM ROW) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-gray-400 text-sm italic">
          <PieChart className="w-8 h-8 mr-2" /> Detailed budget vs actuals
          analytics coming soon...
        </CardContent>
      </Card>
    </div>
  );
}