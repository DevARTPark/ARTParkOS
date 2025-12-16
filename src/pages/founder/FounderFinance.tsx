import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  PieChart as PieIcon, 
  Download,
  Wallet
} from 'lucide-react';

// --- Mock Data for Finance ---
const fundingRounds = [
  { id: 1, round: 'Pre-Seed', date: 'Jan 2023', amount: '₹50L', investor: 'Angel Networks', status: 'Closed' },
  { id: 2, round: 'Grant', date: 'Mar 2023', amount: '₹25L', investor: 'Govt. Startup Scheme', status: 'Received' },
  { id: 3, round: 'Seed', date: 'Pending', amount: '₹2Cr', investor: 'Venture Catalysts', status: 'In Discussion' },
];

const expenseBreakdown = [
  { name: 'R&D & Lab Equipment', value: 45 },
  { name: 'Team Salaries', value: 30 },
  { name: 'Marketing & Sales', value: 10 },
  { name: 'Operations & Legal', value: 10 },
  { name: 'Software & Cloud', value: 5 },
];

const projectAllocation = [
  { name: 'AgriSense IoT', allocated: 4000000, spent: 3200000 },
  { name: 'MediDrone', allocated: 2500000, spent: 1500000 },
  { name: 'Future AI Project', allocated: 1000000, spent: 100000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function FounderFinance() {
  return (
    <DashboardLayout role="founder" title="Financial Overview">
      
      {/* 1. Top Key Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Funding</p>
              <h3 className="text-2xl font-bold text-gray-900">₹75.0 L</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Cash on Hand</p>
              <h3 className="text-2xl font-bold text-gray-900">₹28.4 L</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Monthly Burn</p>
              <h3 className="text-2xl font-bold text-gray-900">₹4.2 L</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Runway</p>
              <h3 className="text-2xl font-bold text-gray-900">~7 Months</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* 2. Expense Distribution (Pie Chart) */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Investment Breakdown</CardTitle>
            <p className="text-sm text-gray-500">Where is your money being invested?</p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseBreakdown.map((entry,KZ) => (
                    <Cell key={`cell-${KZ}`} fill={COLORS[KZ % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Project Allocation (Bar Chart) */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Project Allocation vs. Spent</CardTitle>
            <p className="text-sm text-gray-500">Budget utilization per project</p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectAllocation}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <RechartsTooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Legend />
                <Bar dataKey="allocated" name="Allocated Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Actual Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. Funding Rounds Table */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Funding Rounds</CardTitle>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Round</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Investor / Source</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {fundingRounds.map((round) => (
                  <tr key={round.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{round.round}</td>
                    <td className="px-6 py-4 text-gray-500">{round.date}</td>
                    <td className="px-6 py-4">{round.investor}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{round.amount}</td>
                    <td className="px-6 py-4">
                      <Badge variant={round.status === 'Received' || round.status === 'Closed' ? 'success' : 'warning'}>
                        {round.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Suggestions & Future Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> 
              Projected Needs (Next 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Hiring Plan (4 Engineers)</span>
                <span className="text-sm font-medium text-gray-500">₹15L Needed</span>
              </div>
              <ProgressBar value={40} color="bg-blue-500" />
              <p className="text-xs text-gray-400 mt-1">40% of budget secured</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Pilot Production Batch</span>
                <span className="text-sm font-medium text-gray-500">₹25L Needed</span>
              </div>
              <ProgressBar value={20} color="bg-amber-500" />
              <p className="text-xs text-gray-400 mt-1">Critical for AIRL 6</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white">Smart Finance Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start">
                <div className="bg-white/10 p-1 rounded mr-3 mt-0.5">1</div>
                <span>
                  <strong className="text-white block">Track Unit Economics</strong>
                  Measure your CAC (Customer Acquisition Cost) vs. LTV (Lifetime Value) early. Investors love this.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/10 p-1 rounded mr-3 mt-0.5">2</div>
                <span>
                  <strong className="text-white block">Separate CapEx & OpEx</strong>
                  Keep R&D equipment (CapEx) separate from monthly salaries (OpEx) to calculate accurate burn rates.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/10 p-1 rounded mr-3 mt-0.5">3</div>
                <span>
                  <strong className="text-white block">Grant Management</strong>
                  Ensure utilization certificates for the Govt. grant are filed before applying for the next tranche.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

    </DashboardLayout>
  );
}