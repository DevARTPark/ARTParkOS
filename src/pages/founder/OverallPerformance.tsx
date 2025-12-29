import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { TrendingUp, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface OverallPerformanceProps {
  metrics: {
    promisesMetPercentage: number;
    onTimeSubmissionRate: string;
    streak: number;
  };
  chartData: Array<{ name: string; score: number }>;
}

export function OverallPerformance({ metrics, chartData }: OverallPerformanceProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">
              Promises Met
            </p>
            <h3 className="text-3xl font-extrabold text-green-600">
              {metrics.promisesMetPercentage}%
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">
              Submission Rate
            </p>
            <h3 className="text-3xl font-extrabold text-blue-600">
              {metrics.onTimeSubmissionRate}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">
              Growth Streak
            </p>
            <div className="flex justify-center items-center gap-1 text-3xl font-extrabold text-amber-500">
              {metrics.streak} <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. GOAL COMPLETION CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-500" /> Goal Completion
            Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorScore)" // You can add defs for gradient if needed, or default fill
              />
               {/* Optional Gradient Definition if you want the exact look */}
               <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}