import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  DollarSign, 
  ArrowRight, 
  Clock,
  FileText
} from 'lucide-react';

// --- Mock Data ---

// 1. Critical Reviews (Need Board Attention)
const criticalReviews = [
  { 
    id: 1, 
    startup: 'AutoBotics', 
    type: 'Q3 Quarterly Review', 
    status: 'Red Flagged', 
    reviewer: 'Amit Patel', 
    issue: 'Missed AIRL 3 deadline by 2 months. Cash runway < 3 months.',
    recommendation: 'Place on Probation' 
  },
  { 
    id: 2, 
    startup: 'GreenField Tech', 
    type: 'AIRL 6 Assessment', 
    status: 'Approval Needed', 
    reviewer: 'Dr. Sharma', 
    issue: 'Successfully demonstrated pilot. Ready for Acceleration Phase.',
    recommendation: 'Approve AIRL 7 Promotion' 
  }
];

// 2. Resource/CapEx Requests
const resourceRequests = [
  { 
    id: 101, 
    requestor: 'Robotics Lab Manager', 
    item: 'High-Precision CNC Machine', 
    cost: '₹25.0 L', 
    justification: 'Current machine at 100% capacity. Bottleneck for 3 startups.', 
    urgency: 'High',
    status: 'Pending Board Approval' 
  },
  { 
    id: 102, 
    requestor: 'MediDrone Systems (Founder)', 
    item: 'Additional Office Space (Wing B)', 
    cost: '₹1.5 L / month', 
    justification: 'Team expanded to 15 members. Need dedicated assembly area.', 
    urgency: 'Medium',
    status: 'Under Review' 
  }
];

export function AdminReviewsResources() {
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <DashboardLayout role="admin" title="Governance & Approvals">
      
      <Tabs 
        tabs={[
          { id: 'reviews', label: 'Review Board' },
          { id: 'resources', label: 'Resource Approvals' },
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        className="mb-6"
      />

      {/* --- Tab 1: Review Board --- */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-red-600 uppercase">Critical Interventions</p>
                  <h3 className="text-2xl font-bold text-red-900 mt-1">3</h3>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-300" />
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase">Pending Stage Gates</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">2</h3>
                </div>
                <FileCheck className="w-8 h-8 text-blue-300" />
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase">Completed This Qtr</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">14</h3>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-300" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Approvals Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalReviews.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-full h-12 w-12 flex items-center justify-center ${
                        item.status === 'Red Flagged' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.status === 'Red Flagged' ? <AlertTriangle className="w-6 h-6" /> : <FileCheck className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{item.startup}</h4>
                          <Badge variant="neutral">{item.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2"><strong>Issue:</strong> {item.issue}</p>
                        <div className="flex items-center text-xs text-gray-500 gap-4">
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Reviewer: {item.reviewer}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">Rec: {item.recommendation}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4 md:mt-0 md:min-w-[140px]">
                      <Button size="sm" className={item.status === 'Red Flagged' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}>
                        {item.status === 'Red Flagged' ? 'Intervene' : 'Approve'}
                      </Button>
                      <Button size="sm" variant="outline">View Report</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Tab 2: Resource Approvals --- */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-purple-500">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">CapEx Budget</h3>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-3xl font-bold text-purple-900">₹1.2 Cr</span>
                  <span className="text-sm text-purple-600 font-medium">Remaining</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">65% Utilized this financial year</p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-orange-500">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Facility Capacity</h3>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-3xl font-bold text-orange-900">85%</span>
                  <span className="text-sm text-orange-600 font-medium">Occupancy</span>
                </div>
                <div className="w-full bg-orange-100 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Expansion recommended if &gt; 90%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Resource Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Request Item</th>
                    <th className="px-6 py-4">Requestor</th>
                    <th className="px-6 py-4">Cost / Impact</th>
                    <th className="px-6 py-4">Business Justification</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resourceRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {req.item}
                      </td>
                      <td className="px-6 py-4">{req.requestor}</td>
                      <td className="px-6 py-4 font-mono font-medium text-gray-700">{req.cost}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={req.justification}>
                        {req.justification}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={req.urgency === 'High' ? 'danger' : 'warning'}>{req.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50"><XCircle className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50"><CheckCircle2 className="w-4 h-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

    </DashboardLayout>
  );
}