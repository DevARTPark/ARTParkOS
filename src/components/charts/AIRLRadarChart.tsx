import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Define the shape of the data point for type safety
export interface AIRLChartDataPoint {
  subject: string;
  A: number; // The score
  fullMark: number; // Max possible score (9)
}

interface AIRLRadarChartProps {
  data: AIRLChartDataPoint[];
}

export function AIRLRadarChart({ data }: AIRLRadarChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 9]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="AIRL Score"
            dataKey="A"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            itemStyle={{ color: '#1d4ed8', fontWeight: 600 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}