import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  ArrowDownToLine, 
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Lock
} from 'lucide-react';

// Import Shared Data types and defaults
import { initialTasks, ReviewTask } from '../../data/mockReviewerTasks';

export function ReviewerTaskPool() {
  const navigate = useNavigate();
  
  // 1. LOAD TASKS FROM LOCAL STORAGE
  const [tasks, setTasks] = useState<ReviewTask[]>(() => {
    const savedTasks = localStorage.getItem('mock_reviewer_tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  // --- FILTER STATES ---
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // REMOVED: const unassignedTasks = tasks.filter(t => t.assigneeId === null);
  // Now we want to see ALL tasks, just with different actions.

  const filteredTasks = tasks.filter(task => { // Filtering 'tasks' directly, not 'unassignedTasks'
    const matchesSearch = task.startup.toLowerCase().includes(search.toLowerCase()) || 
                          task.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || task.type === typeFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

    // Optional: You might want to filter out 'Completed' tasks if the pool gets too big, 
    // but for now we keep 'Pending' and 'In Progress' visible.
    const isVisibleStatus = task.status !== 'Completed'; 

    return matchesSearch && matchesType && matchesPriority && isVisibleStatus;
  });

  const handleAcceptTask = (taskId: string) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, assigneeId: 'me', status: 'In Progress' } : t
    );
    
    setTasks(updatedTasks as ReviewTask[]); 
    localStorage.setItem('mock_reviewer_tasks', JSON.stringify(updatedTasks));
    navigate('/reviewer/tasks'); 
  };

  const handleViewTask = (taskId: string) => {
    // Navigate to review page in read-only mode
    // We pass state to indicate read-only, or the page can infer it from assigneeId != me
    navigate(`/reviewer/review/${taskId}`, { state: { readOnly: true } });
  };

  return (
    <DashboardLayout role="reviewer" title="Task Pool (Open Queue)">
      
      {/* Header Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">How this works</h4>
          <p className="text-xs text-blue-700 mt-1">
            Tasks in <strong>white</strong> are open for assignment. Tasks in <strong>gray</strong> are already assigned to other reviewers but can be viewed.
          </p>
        </div>
      </div>

      {/* Controls (Unchanged) */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={showFilters ? 'secondary' : 'outline'} 
              size="sm" 
              leftIcon={showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Close Filters' : 'Filter'}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Task Type</label>
              <select 
                className="w-full text-sm border-gray-200 rounded-md p-1.5"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="AIRL Assessment">AIRL Assessment</option>
                <option value="Monthly Report">Monthly Report</option>
                <option value="Quarterly Review">Quarterly Review</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Priority</label>
              <select 
                className="w-full text-sm border-gray-200 rounded-md p-1.5"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isAssigned = task.assigneeId !== null;
            const isAssignedToMe = task.assigneeId === 'me'; // Assuming 'me' is current user

            return (
              <Card 
                key={task.id} 
                className={`transition-colors border-l-4 ${
                  isAssigned 
                    ? 'bg-gray-50 border-gray-200 border-l-gray-400 opacity-90' // Dimmed style for assigned
                    : 'bg-white hover:border-blue-300 border-l-transparent hover:border-l-blue-500' // Active style for open
                }`}
              >
                <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                  
                  {/* Left: Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg border shadow-sm ${isAssigned ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-100'}`}>
                      {isAssigned ? <Lock className="w-6 h-6 text-gray-400" /> : <ClipboardList className="w-6 h-6 text-slate-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${isAssigned ? 'text-gray-600' : 'text-gray-900'}`}>{task.title}</h3>
                        
                        {/* Tags */}
                        <Badge variant={task.priority === 'High' ? 'danger' : 'neutral'}>
                          {task.priority} Priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">{task.type}</Badge>
                        
                        {/* Assigned Badge */}
                        {isAssigned && (
                          <Badge variant="warning" className="flex items-center gap-1">
                            {isAssignedToMe ? 'Assigned to You' : 'Assigned (Read Only)'}
                          </Badge>
                        )}
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
                    {isAssigned ? (
                      <Button 
                        onClick={() => handleViewTask(task.id)}
                        variant="secondary"
                        className="text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 min-w-[140px]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Answers
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleAcceptTask(task.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                      >
                        <ArrowDownToLine className="w-4 h-4 mr-2" />
                        Accept Task
                      </Button>
                    )}
                  </div>

                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium">No tasks found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
            <Button variant="link" onClick={() => {setTypeFilter('All'); setPriorityFilter('All'); setSearch('')}}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}