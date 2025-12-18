import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  ArrowDownToLine, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Import Shared Data (In a real app, fetch from API)
import { initialTasks, ReviewTask } from '../../data/mockReviewerTasks';

export function ReviewerTaskPool() {
  const navigate = useNavigate();
  // In a real app, this state would be managed by React Query or Redux
  const [tasks, setTasks] = useState<ReviewTask[]>(initialTasks);
  const [search, setSearch] = useState('');

  // Filter for UNASSIGNED tasks
  const unassignedTasks = tasks.filter(t => t.assigneeId === null);

  const filteredTasks = unassignedTasks.filter(task => 
    task.startup.toLowerCase().includes(search.toLowerCase()) || 
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAcceptTask = (taskId: string) => {
    // 1. Update local state (Optimistic UI update)
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, assigneeId: 'me', status: 'In Progress' } : t
    );
    setTasks(updatedTasks as ReviewTask[]); // Cast to avoid strict type issues in mock

    // 2. Alert user
    // alert("Task Accepted! Moved to 'My Tasks'."); 
    // Ideally navigate or show toast
    navigate('/reviewer/tasks'); 
  };

  return (
    <DashboardLayout role="reviewer" title="Task Pool (Open Queue)">
      
      {/* Header Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">How this works</h4>
          <p className="text-xs text-blue-700 mt-1">
            These tasks are pending assignment. Click <strong>Accept</strong> to claim a task. 
            Once accepted, it will move to your personal <strong>My Tasks</strong> queue and be locked for other reviewers.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search open tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:border-blue-300 transition-colors">
              <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Left: Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <ClipboardList className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <Badge variant={task.priority === 'High' ? 'danger' : 'neutral'}>
                        {task.priority} Priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">{task.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="font-medium text-slate-700">{task.startup}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Due in {task.due}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button 
                    onClick={() => handleAcceptTask(task.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                  >
                    <ArrowDownToLine className="w-4 h-4 mr-2" />
                    Accept Task
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium">All caught up!</h3>
            <p className="text-gray-500 text-sm">There are no pending tasks in the pool right now.</p>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}