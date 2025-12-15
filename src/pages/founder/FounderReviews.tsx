import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Textarea, Input } from '../../components/ui/Input';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar,
  ChevronRight,
  Target,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Mock Data ---

const currentQuarterGoals = [
  "Complete Lab Trials for Prototype V2",
  "Onboard 2 Pilot Customers",
  "Hire Senior Embedded Engineer"
];

const monthlyReviews = [
  { id: 1, month: 'October 2023', status: 'Submitted', date: 'Oct 28, 2023', file: 'Oct_Progress_1Pager.pdf' },
  { id: 2, month: 'November 2023', status: 'Pending', date: 'Due: Nov 30, 2023', file: null },
  { id: 3, month: 'December 2023', status: 'Locked', date: 'Opens: Dec 25, 2023', file: null },
];

const quarterlyHistory = [
  {
    id: 'q3-2023',
    quarter: 'Q3 2023',
    status: 'Yellow', // Red, Yellow, Green
    score: 'Needs Attention',
    reviewer: 'Dr. Priya Sharma',
    feedback: 'Technical milestones met, but commercial partnerships are lagging behind the promised timeline.',
    promises: [
      { text: 'Achieve TRL 3', status: 'Met' },
      { text: 'File Provisional Patent', status: 'Met' },
      { text: 'Sign 1 MOU', status: 'Missed' }
    ]
  },
  {
    id: 'q2-2023',
    quarter: 'Q2 2023',
    status: 'Green',
    score: 'On Track',
    reviewer: 'Rahul Verma',
    feedback: 'Excellent execution. The team exceeded expectations on prototype development.',
    promises: [
      { text: 'Form Core Team', status: 'Met' },
      { text: 'Market Research Report', status: 'Met' }
    ]
  }
];

// --- Components ---

export function FounderReviews() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleOpenSubmit = (month: string) => {
    setSelectedMonth(month);
    setShowSubmitModal(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Green': return 'bg-green-100 text-green-800 border-green-200';
      case 'Yellow': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout role="founder" title="Performance Reviews & Milestones">
      
      <div className="flex justify-between items-center mb-6">
        <Tabs 
          tabs={[
            { id: 'monthly', label: 'Monthly Updates' },
            { id: 'quarterly', label: 'Quarterly Deep Dive' }
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        <div className="text-sm text-gray-500 flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Current Period: <span className="font-semibold text-gray-900 ml-1">Q4 2023</span>
        </div>
      </div>

      {/* --- Tab 1: Monthly Reviews --- */}
      {activeTab === 'monthly' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Monthly Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {monthlyReviews.map((review) => (
              <Card key={review.id} className={review.status === 'Locked' ? 'opacity-75 bg-gray-50' : ''}>
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      review.status === 'Submitted' ? 'bg-green-100 text-green-600' :
                      review.status === 'Pending' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{review.month}</h3>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {review.status === 'Submitted' ? (
                      <div className="flex items-center gap-3">
                        <Badge variant="success">Submitted</Badge>
                        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                          View PDF
                        </Button>
                      </div>
                    ) : review.status === 'Pending' ? (
                      <Button onClick={() => handleOpenSubmit(review.month)} leftIcon={<Upload className="w-4 h-4" />}>
                        Submit 1-Pager
                      </Button>
                    ) : (
                      <Badge variant="neutral">Locked</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right: Current Quarter Targets Context */}
          <div>
            <Card className="bg-blue-50 border-blue-100 h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Target className="w-5 h-5 mr-2" /> Q4 Promises
                </CardTitle>
                <p className="text-xs text-blue-600 mt-1">
                  Your monthly updates should reflect progress towards these goals.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuarterGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <div className="mt-1 min-w-[1.25rem]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                        {idx + 1}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{goal}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* --- Tab 2: Quarterly Reviews --- */}
      {activeTab === 'quarterly' && (
        <div className="space-y-8">
          {quarterlyHistory.map((q) => (
            <Card key={q.id} className="overflow-hidden">
              <div className={`h-2 w-full ${q.status === 'Green' ? 'bg-green-500' : q.status === 'Yellow' ? 'bg-amber-500' : 'bg-red-500'}`} />
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{q.quarter} Review</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(q.status)}`}>
                      Status: {q.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Reviewed by {q.reviewer}</p>
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm">Download Full Report</Button>
                </div>
              </CardHeader>
              
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feedback Section */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase mb-2">Reviewer Feedback</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm leading-relaxed">
                      "{q.feedback}"
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase mb-2">Promise Checklist</h4>
                    <div className="space-y-2">
                      {q.promises.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors border-b border-gray-50 last:border-0">
                          <span className="text-sm text-gray-700">{p.text}</span>
                          {p.status === 'Met' ? (
                            <Badge variant="success" className="w-20 justify-center">Met</Badge>
                          ) : (
                            <Badge variant="danger" className="w-20 justify-center">Missed</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score Card Section */}
                <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-100">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-4 ${
                    q.status === 'Green' ? 'bg-green-100 text-green-600' : 
                    q.status === 'Yellow' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {q.status === 'Green' ? 'A' : q.status === 'Yellow' ? 'B' : 'C'}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{q.score}</h4>
                  <p className="text-xs text-gray-500">Overall Grading</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- Submit Modal --- */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Submit 1-Pager</h3>
                <p className="text-xs text-gray-500">For {selectedMonth}</p>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg text-xs text-blue-700 flex gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <p>Please highlight progress on "Lab Trials" and "Pilot Onboarding" as these were your key promises for this quarter.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements</label>
                  <Textarea placeholder="Summarize your top 3 wins this month..." rows={3} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blockers / Risks</label>
                  <Textarea placeholder="Are you facing any critical issues?" rows={2} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload 1-Pager PDF</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-blue-600 font-medium">Click to upload report</span>
                    <span className="text-xs text-gray-400 mt-1">Max 5MB (PDF only)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
              <Button onClick={() => setShowSubmitModal(false)}>Submit Update</Button>
            </div>
          </motion.div>
        </div>
      )}

    </DashboardLayout>
  );
}