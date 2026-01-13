import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { 
  TrendingUp, 
  Target, 
  CalendarCheck, 
  Award, 
  ArrowUpRight,
  Zap,
  Activity,
  CheckCircle2
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface OverallPerformanceProps {
  metrics: {
    promisesMetPercentage: number;
    onTimeSubmissionRate: string;
    streak: number;
  };
  chartData: Array<{ name: string; score: number }>;
}

// Mock Data for the Radar Chart (Readiness Dimensions)
const RADAR_DATA = [
  { subject: 'Technology', A: 80, fullMark: 100 },
  { subject: 'Market', A: 65, fullMark: 100 },
  { subject: 'Business Model', A: 50, fullMark: 100 },
  { subject: 'Team', A: 90, fullMark: 100 },
  { subject: 'IP/Legal', A: 70, fullMark: 100 },
  { subject: 'Financials', A: 60, fullMark: 100 },
];

export function OverallPerformance({ metrics, chartData }: OverallPerformanceProps) {
  
  // Parse rate string to number for visual logic (e.g. "95%" -> 95)
  const submissionRateNum = parseInt(metrics.onTimeSubmissionRate.replace('%', '')) || 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* 1. EXECUTIVE KPI SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Execution Score */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Execution Score</p>
                <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                  {metrics.promisesMetPercentage}%
                  {metrics.promisesMetPercentage >= 80 && (
                    <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" /> Excellent
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400 mt-2">Based on quarterly promises kept</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Compliance/Submission */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reporting Health</p>
                <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                  {metrics.onTimeSubmissionRate}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 max-w-[100px]">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${submissionRateNum}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">On-time submission rate</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Momentum Streak */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Growth Streak</p>
                <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                  {metrics.streak} <span className="text-sm font-medium text-gray-500 ml-1">Months</span>
                </h3>
                <p className="text-xs text-gray-400 mt-2">Consecutive months meeting goals</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: AIRL Status (Mocked/Derived) */}
        <Card className="border-l-4 border-l-purple-600 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Readiness</p>
                <h3 className="text-2xl font-extrabold text-purple-700 flex items-center">
                  AIRL 4
                </h3>
                <p className="text-xs text-purple-600 mt-2 font-medium">
                  +1 Level increase this Quarter
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. ANALYTICS CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART A: Trend Analysis */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" /> 
                  Performance Trajectory
                </CardTitle>
                <CardDescription>Goal completion score over the last 6 months</CardDescription>
              </div>
              <Badge variant="neutral">6 Months</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CHART B: Readiness Radar */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Maturity Balance
            </CardTitle>
            <CardDescription>AIRL dimensions analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Current State"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. INSIGHTS & SUMMARY */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-2 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" /> 
                System Analysis
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your startup is showing strong momentum in <strong>Technology</strong> and <strong>Team</strong> dimensions. 
                However, <strong>Business Model</strong> validation is lagging behind technical progress. 
                To reach the next AIRL milestone, focus on securing pilot LOIs.
              </p>
            </div>
            <div className="md:w-1/3 bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h5 className="text-sm font-bold text-slate-200 uppercase mb-3">Key Strengths</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Consistent Execution
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Technical Maturity
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Resource Utilization
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}