import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Textarea } from '../../components/ui/Input';
import { 
  ArrowLeft, 
  Download, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';

// --- Mock Data: Detailed ---
const startupDetails = {
  id: 's1',
  name: 'GreenField Tech',
  status: 'Green',
  trl: 3,
  description: 'Developing IoT sensors for precision agriculture monitoring soil health.',
  founder: 'Alex Chen',
  email: 'alex@greenfield.com'
};

const financialData = [
  { name: 'Q1', budget: 10, spent: 8 },
  { name: 'Q2', budget: 15, spent: 14 },
  { name: 'Q3', budget: 20, spent: 18 },
  { name: 'Q4 (Proj)', budget: 25, spent: 5 },
];

const promises = [
  { id: 1, text: 'Complete Lab Trials', deadline: 'Oct 30', status: 'On Track' },
  { id: 2, text: 'Hire Embedded Engineer', deadline: 'Nov 15', status: 'Risk', riskReason: 'No qualified candidates found yet' },
  { id: 3, text: 'Sign 2 Pilot MOUs', deadline: 'Dec 01', status: 'Completed' },
];

const assessments = [
  { id: 'a1', level: 'TRL 1', date: 'Jan 15, 2023', status: 'Approved', reviewer: 'Dr. Sharma' },
  { id: 'a2', level: 'TRL 2', date: 'Jun 20, 2023', status: 'Approved', reviewer: 'Rahul V.' },
  { id: 'a3', level: 'TRL 3', date: 'Oct 24, 2023', status: 'Under Review', reviewer: 'Unassigned' },
];

export function ReviewerStartupDetail() {
  const { id } = useParams(); // startup ID
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [comment, setComment] = useState('');

  return (
    <DashboardLayout role="reviewer" title={`Startup Profile: ${startupDetails.name}`}>
      
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/reviewer/portfolio')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Portfolio
        </Button>
      </div>

      {/* Header Info Card */}
      <Card className="mb-6 border-l-4 border-l-green-500">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{startupDetails.name}</h1>
              <Badge variant="success">Active</Badge>
              <Badge variant="info">TRL {startupDetails.trl}</Badge>
            </div>
            <p className="text-gray-500 mt-1 max-w-2xl">{startupDetails.description}</p>
            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              <span>Founder: <strong>{startupDetails.founder}</strong></span>
              <span>•</span>
              <span>{startupDetails.email}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" leftIcon={<MessageSquare className="w-4 h-4" />}>
              Message Founder
            </Button>
            <Button>
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs 
        tabs={[
          { id: 'overview', label: 'Overview & Promises' },
          { id: 'finance', label: 'Finance & Funding' },
          { id: 'assessment', label: 'AIRL Assessments' },
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab}
        className="mb-6"
      />

      {/* --- Tab 1: Overview & Promises --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Q4 Promises & Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {promises.map((p) => (
                <div key={p.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{p.text}</p>
                    <p className="text-xs text-gray-500 mt-1">Due: {p.deadline}</p>
                    {p.status === 'Risk' && (
                      <p className="text-xs text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> {p.riskReason}
                      </p>
                    )}
                  </div>
                  <Badge variant={p.status === 'Completed' ? 'success' : p.status === 'Risk' ? 'danger' : 'warning'}>
                    {p.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviewer Notes (Internal)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-4 text-sm text-yellow-800">
                <strong>Previous Note (Oct 10):</strong> Startup is technically strong but struggling with hiring. Suggested they use the ARTPark talent portal.
              </div>
              <Textarea 
                placeholder="Add a private note for other reviewers..." 
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="mt-3 flex justify-end">
                <Button size="sm" onClick={() => setComment('')}>Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Tab 2: Finance --- */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Budget vs Actuals</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="budget" name="Budget (Lakhs)" fill="#3b82f6" />
                  <Bar dataKey="spent" name="Spent (Lakhs)" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Funding Health</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total Grant</span>
                  <span className="font-bold text-lg">₹50.0 L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Disbursed</span>
                  <span className="font-bold text-lg text-green-600">₹30.0 L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Utilized</span>
                  <span className="font-bold text-lg text-blue-600">₹28.5 L</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">Utilization %</p>
                  <ProgressBar value={95} color="bg-amber-500" />
                  <p className="text-xs text-amber-500 mt-1">95% utilized - Next tranche due soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* --- Tab 3: AIRL Assessments --- */}
      {activeTab === 'assessment' && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.map((a) => (
                <div key={a.id} className="flex flex-col md:flex-row justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{a.level} Assessment</h4>
                      <p className="text-sm text-gray-500">Submitted on {a.date}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">Reviewer: {a.reviewer}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                    <Badge variant={a.status === 'Approved' ? 'success' : 'warning'}>
                      {a.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" leftIcon={<Download className="w-3 h-3" />}>
                        PDF
                      </Button>
                      <Button size="sm" onClick={() => navigate(`/reviewer/review/${a.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </DashboardLayout>
  );
}