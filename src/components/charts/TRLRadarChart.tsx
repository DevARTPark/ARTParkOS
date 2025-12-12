import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
const data = [{
  subject: 'Technology',
  A: 4,
  fullMark: 9
}, {
  subject: 'Product',
  A: 3,
  fullMark: 9
}, {
  subject: 'Market',
  A: 5,
  fullMark: 9
}, {
  subject: 'Org',
  A: 2,
  fullMark: 9
}, {
  subject: 'Engagement',
  A: 4,
  fullMark: 9
}];
export function TRLRadarChart() {
  return <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{
          fill: '#6b7280',
          fontSize: 12
        }} />
          <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />
          <Radar name="Current TRL" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
          <Tooltip contentStyle={{
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>;
}