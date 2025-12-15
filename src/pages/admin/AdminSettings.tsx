import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { 
  Settings, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Save, 
  AlertTriangle
} from 'lucide-react';

// --- Mock Data ---
const trlLevels = [
  { level: 1, def: 'Basic principles observed', status: 'Active' },
  { level: 2, def: 'Technology concept formulated', status: 'Active' },
  { level: 3, def: 'Experimental proof of concept', status: 'Active' },
  { level: 4, def: 'Technology validated in lab', status: 'Active' },
  { level: 5, def: 'Technology validated in relevant environment', status: 'Active' },
];

const auditLogs = [
  { id: 1, action: 'Updated TRL 3 Criteria', user: 'Admin User', time: '2 hrs ago' },
  { id: 2, action: 'Approved Grant Disbursement (Batch A)', user: 'Finance Lead', time: '5 hrs ago' },
  { id: 3, action: 'Added New Reviewer: Sarah Lee', user: 'Admin User', time: '1 day ago' },
];

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('governance');

  return (
    <DashboardLayout role="admin" title="Platform Configuration & Governance">
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          <Card>
            <CardContent className="p-2">
              {[
                { id: 'governance', label: 'TRL Framework', icon: ShieldCheck },
                { id: 'cycles', label: 'Reporting Cycles', icon: Calendar },
                { id: 'audit', label: 'Audit Logs', icon: FileText },
                { id: 'general', label: 'General Settings', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* --- Tab 1: TRL Framework --- */}
          {activeTab === 'governance' && (
            <Card>
              <CardHeader>
                <CardTitle>Technology Readiness Level (TRL) Definitions</CardTitle>
                <p className="text-sm text-gray-500">These definitions appear on Founder assessments and Reviewer forms.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {trlLevels.map((lvl) => (
                  <div key={lvl.level} className="flex gap-4 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="bg-blue-100 text-blue-700 font-bold w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0">
                      {lvl.level}
                    </div>
                    <div className="flex-1">
                      <Input defaultValue={lvl.def} className="bg-white" />
                    </div>
                    <div className="flex items-center pt-2">
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Button leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- Tab 2: Reporting Cycles --- */}
          {activeTab === 'cycles' && (
            <Card>
              <CardHeader>
                <CardTitle>Global Reporting Configuration</CardTitle>
                <p className="text-sm text-gray-500">Set deadlines for Monthly and Quarterly updates.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Quarter</label>
                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                      <option>Q4 2023 (Oct - Dec)</option>
                      <option>Q1 2024 (Jan - Mar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Submission Deadline</label>
                    <Input type="date" defaultValue="2023-10-15" />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Strict Enforcement Mode</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      If enabled, Founders cannot submit reports after the deadline without Admin approval.
                    </p>
                    <div className="mt-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="text-amber-600 rounded" defaultChecked />
                        <span className="text-sm font-medium text-amber-900">Enable Strict Mode</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- Tab 3: Audit Logs --- */}
          {activeTab === 'audit' && (
            <Card>
              <CardHeader>
                <CardTitle>System Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 py-3 text-gray-900">{log.action}</td>
                        <td className="px-4 py-3 text-gray-600">{log.user}</td>
                        <td className="px-4 py-3 text-right text-gray-400 font-mono text-xs">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}