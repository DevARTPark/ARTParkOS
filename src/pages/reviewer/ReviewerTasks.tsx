import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { 
  ClipboardCheck, 
  FileText, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  PlayCircle,
  XCircle // New icon for releasing task
} from 'lucide-react';

// Import Shared Data types
import { initialTasks, ReviewTask } from '../../data/mockReviewerTasks';

export function ReviewerTasks() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  // 1. LOAD SHARED STATE
  const [allTasks, setAllTasks] = useState<ReviewTask[]>(() => {
    const savedTasks = localStorage.getItem('mock_reviewer_tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  // --- NEW: HANDLE RELEASE TASK (Return to Pool) ---
  const handleReleaseTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!window.confirm("Are you sure you want to release this task back to the pool?")) return;

    const updatedTasks = allTasks.map(t => 
      t.id === taskId ? { ...t, assigneeId: null, status: 'Pending' } : t
    );

    setAllTasks(updatedTasks);
    localStorage.setItem('mock_reviewer_tasks', JSON.stringify(updatedTasks));
  };

  // Filter: Only show tasks assigned to 'me'
  const myTasks = allTasks.filter(t => t.assigneeId === 'me');

  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = task.startup.toLowerCase().includes(search.toLowerCase()) || 
                          task.title.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'high_priority') return matchesSearch && task.priority === 'High';
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
    <DashboardLayout role="reviewer" title="My Assigned Tasks">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Tabs 
          tabs={[
            { id: 'all', label: `All Tasks (${myTasks.length})` },
            { id: 'high_priority', label: 'High Priority' },
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search my tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow group cursor-pointer border-l-4 border-l-blue-500" 
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
                        <Badge variant="success" className="text-[10px]">Assigned to Me</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                        <span className="flex items-center text-gray-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                          {task.startup}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="text-right">
                      <span className="text-xs font-medium text-gray-500 block mb-1">Due Date</span>
                      <span className={`text-sm font-bold ${task.priority === 'High' ? 'text-red-600' : 'text-gray-900'}`}>
                        {task.due}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 w-full">
                      {/* Release Button */}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                        title="Release back to pool"
                        onClick={(e) => handleReleaseTask(e, task.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>

                      {/* Start Button */}
                      <Button size="sm" className="flex-1 group-hover:bg-blue-700 transition-colors">
                        Start <PlayCircle className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
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
            <h3 className="text-gray-900 font-medium">No active tasks</h3>
            <p className="text-gray-500 text-sm mt-1">
              Go to the <a href="/reviewer/pool" className="text-blue-600 hover:underline">Task Pool</a> to claim new work.
            </p>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}