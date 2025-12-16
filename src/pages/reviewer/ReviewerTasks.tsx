import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { 
  ClipboardCheck, 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

// --- Mock Data: Reviewer Work Queue ---
const allTasks = [
  {
    id: 't1',
    startup: 'GreenField Tech',
    type: 'AIRL Assessment',
    title: 'AIRL 3 Verification: Lab Scale Validation',
    priority: 'High',
    due: 'Today',
    status: 'Pending',
    submittedDate: 'Oct 24, 2023',
    description: 'Verify lab results against the technical milestones for AIRL 3.'
  },
  {
    id: 't2',
    startup: 'MediDrone Systems',
    type: 'Monthly Report',
    title: 'October 1-Pager Review',
    priority: 'Medium',
    due: 'Tomorrow',
    status: 'Pending',
    submittedDate: 'Oct 25, 2023',
    description: 'Review monthly progress on "Pilot Onboarding" goal.'
  },
  {
    id: 't3',
    startup: 'AgriSense IoT',
    type: 'Quarterly Review',
    title: 'Q3 Deep Dive & Grading',
    priority: 'High',
    due: 'Oct 30',
    status: 'In Progress',
    submittedDate: 'Oct 20, 2023',
    description: 'Assess Q3 promises vs actuals and assign R/Y/G status.'
  },
  {
    id: 't4',
    startup: 'SolarFlow',
    type: 'Mentorship Request',
    title: 'Approve Mentor Request: Dr. Sharma',
    priority: 'Low',
    due: 'Nov 02',
    status: 'Pending',
    submittedDate: 'Oct 26, 2023',
    description: 'Startup requesting specialized mentorship for material science.'
  },
];

export function ReviewerTasks() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  // Filter Logic
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.startup.toLowerCase().includes(search.toLowerCase()) || 
                          task.title.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'high_priority') return matchesSearch && task.priority === 'High';
    if (activeTab === 'assessments') return matchesSearch && task.type === 'AIRL Assessment';
    if (activeTab === 'reports') return matchesSearch && (task.type === 'Monthly Report' || task.type === 'Quarterly Review');
    return matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'AIRL Assessment': return <ClipboardCheck className="w-5 h-5 text-blue-600" />;
      case 'Monthly Report': return <FileText className="w-5 h-5 text-purple-600" />;
      case 'Quarterly Review': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default: return <CheckCircle2 className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout role="reviewer" title="Assigned Tasks">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Tabs 
          tabs={[
            { id: 'all', label: 'All Tasks' },
            { id: 'high_priority', label: 'High Priority' },
            { id: 'assessments', label: 'Assessments' },
            { id: 'reports', label: 'Reports' },
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search startup or task..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow group cursor-pointer" 
                  onClick={() => window.location.href = `/reviewer/review/${task.id}`}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  
                  {/* Left: Icon & Info */}
                  <div className="flex gap-4 items-start flex-1">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      {getIcon(task.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        {task.priority === 'High' && (
                          <Badge variant="danger" className="text-[10px] px-1.5 py-0 h-5">High Priority</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                        <span className="flex items-center text-gray-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                          {task.startup}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> Submitted: {task.submittedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Action */}
                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="text-right">
                      <span className="text-xs font-medium text-gray-500 block mb-1">Due Date</span>
                      <span className={`text-sm font-bold ${task.priority === 'High' ? 'text-red-600' : 'text-gray-900'}`}>
                        {task.due}
                      </span>
                    </div>
                    <Button size="sm" className="w-full group-hover:bg-blue-700 transition-colors">
                      Review <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClipboardCheck className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">No tasks found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}