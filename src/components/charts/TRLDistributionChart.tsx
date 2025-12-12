import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
const data = [{
  name: 'TRL 1',
  count: 4
}, {
  name: 'TRL 2',
  count: 8
}, {
  name: 'TRL 3',
  count: 12
}, {
  name: 'TRL 4',
  count: 6
}, {
  name: 'TRL 5',
  count: 3
}, {
  name: 'TRL 6',
  count: 2
}, {
  name: 'TRL 7',
  count: 1
}];
export function TRLDistributionChart() {
  return <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{
        top: 10,
        right: 10,
        left: -20,
        bottom: 0
      }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
          fill: '#9ca3af',
          fontSize: 12
        }} />
          <YAxis axisLine={false} tickLine={false} tick={{
          fill: '#9ca3af',
          fontSize: 12
        }} />
          <Tooltip cursor={{
          fill: '#f9fafb'
        }} contentStyle={{
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={index > 3 ? '#3b82f6' : '#93c5fd'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>;
}