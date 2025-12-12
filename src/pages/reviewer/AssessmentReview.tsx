import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Input';
import { trlQuestions } from '../../data/mockData';
import { ArrowLeft, Check, X, AlertCircle, FileText, ExternalLink } from 'lucide-react';
export function AssessmentReview() {
  const [selectedQuestion, setSelectedQuestion] = useState(trlQuestions[0]);
  return <DashboardLayout role="reviewer" title="Review Assessment: GreenField Tech">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        {/* Left: Question List */}
        <div className="col-span-3 flex flex-col h-full">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
              <h3 className="font-semibold text-gray-900">Questions</h3>
              <p className="text-xs text-gray-500">TRL 1 Assessment</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {trlQuestions.map((q, idx) => <button key={q.id} onClick={() => setSelectedQuestion(q)} className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedQuestion.id === q.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      Q{idx + 1}
                    </span>
                    <Badge variant="neutral" className="text-[10px] px-1.5 py-0">
                      {q.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-2">{q.text}</p>
                </button>)}
            </div>
          </Card>
        </div>

        {/* Middle: Founder Answer */}
        <div className="col-span-5 flex flex-col h-full">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <div className="p-6 border-b border-gray-100">
              <Badge variant="info" className="mb-2">
                {selectedQuestion.category}
              </Badge>
              <h2 className="text-lg font-bold text-gray-900">
                {selectedQuestion.text}
              </h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Founder Response
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
                  <div className="flex items-center mb-3">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                      <Check className="w-3 h-3 mr-1" /> Yes
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We have conducted initial lab tests observing the core
                    principles. The results align with theoretical predictions
                    outlined in our whitepaper.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Evidence
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                    <FileText className="w-8 h-8 text-red-500 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Lab_Report_v1.pdf
                      </p>
                      <p className="text-xs text-gray-500">
                        2.4 MB • Uploaded 2 days ago
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Reviewer Input */}
        <div className="col-span-4 flex flex-col h-full">
          <Card className="h-full flex flex-col border-0 shadow-md">
            <div className="p-4 border-b border-gray-100 bg-blue-50/30 rounded-t-lg">
              <h3 className="font-semibold text-gray-900">Your Evaluation</h3>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all">
                      <Check className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">Yes</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition-all">
                      <AlertCircle className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">Partial</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all">
                      <X className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">No</span>
                    </button>
                  </div>
                </div>

                <Textarea label="Comments" placeholder="Provide feedback for the founder..." rows={4} />

                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parameter Score Suggestion
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>TRL 1</option>
                    <option>TRL 2</option>
                    <option>TRL 3</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <Button className="w-full">Save & Next</Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>;
}