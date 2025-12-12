import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { reviews } from '../../data/mockData';
import { Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';
export function ReviewerDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  return <DashboardLayout role="reviewer" title="Reviewer Portal">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assigned Reviews</CardTitle>
              <Tabs tabs={[{
              id: 'pending',
              label: 'Pending'
            }, {
              id: 'completed',
              label: 'Completed'
            }]} activeTab={activeTab} onChange={setActiveTab} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.filter(r => r.status === activeTab).map(review => <div key={review.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {review.startupName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {review.projectName}
                          </p>
                          <div className="flex items-center mt-2 space-x-3">
                            <Badge variant="info">TRL {review.trlLevel}</Badge>
                            <span className="text-xs text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> Due:{' '}
                              {review.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => window.location.href = `/reviewer/review/${review.id}`}>
                        {activeTab === 'pending' ? 'Start Review' : 'View Report'}
                      </Button>
                    </div>)}
                {reviews.filter(r => r.status === activeTab).length === 0 && <div className="text-center py-12 text-gray-400">
                    No {activeTab} reviews found.
                  </div>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                Calendar Widget Placeholder
              </div>
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">
                  Upcoming Deadlines
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">GreenField Tech Review</span>
                  <span className="text-red-500 font-medium">Tomorrow</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>;
}