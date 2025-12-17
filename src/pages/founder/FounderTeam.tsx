import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Input, Textarea } from '../../components/ui/Input';

// Import Shared Data
import { actionItems } from '../../data/mockData';
import { teams as initialTeams, initialTasks, members } from '../../data/teamData';

import { 
  Users, 
  UserPlus, 
  Briefcase, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreHorizontal,
  Plus, 
  Search, 
  Zap, 
  BarChart3,
  X 
} from 'lucide-react';

export function FounderTeam() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for Data
  const [myTeams, setMyTeams] = useState(initialTeams);
  const [tasks, setTasks] = useState(initialTasks);

  // Modals State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false); // <--- NEW STATE

  // Form State
  const [newTask, setNewTask] = useState({ title: '', team: '', priority: 'Medium' });
  const [newTeam, setNewTeam] = useState({ name: '', lead: '', expertise: '' }); // <--- NEW STATE

  // --- Handlers ---

  const handleAssignTask = () => {
    if (!newTask.title || !newTask.team) return;
    
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      team: newTask.team,
      assignee: 'Unassigned', 
      status: 'To Do',
      priority: newTask.priority,
      due: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    
    setTasks([...tasks, task]);

    // Sync with Dashboard Actions
    const dashboardAction = {
      id: `team-task-${Date.now()}`,
      title: `${newTask.title} (${newTask.team})`,
      status: 'open',
      priority: newTask.priority.toLowerCase(),
      dueDate: new Date().toISOString().split('T')[0]
    };
    actionItems.unshift(dashboardAction);

    setShowAssignModal(false);
    setNewTask({ title: '', team: '', priority: 'Medium' });
  };

  const handleAddTeam = () => {
    if (!newTeam.name || !newTeam.lead) return;

    const teamToAdd = {
      id: `t-new-${Date.now()}`,
      name: newTeam.name,
      lead: newTeam.lead,
      members: 1, // Default to 1 (the lead)
      workload: 0, // Fresh team has 0 workload
      expertise: newTeam.expertise.split(',').map(s => s.trim()).filter(s => s), // Split comma-separated string
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newTeam.lead)}&background=random&color=fff`
    };

    setMyTeams([...myTeams, teamToAdd]);
    setShowAddTeamModal(false);
    setNewTeam({ name: '', lead: '', expertise: '' });
  };

  return (
    <DashboardLayout role="founder" title="My Team & Work Allocation">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Tabs 
          tabs={[
            { id: 'overview', label: 'Teams Overview' },
            { id: 'tasks', label: 'Task Board' },
            { id: 'directory', label: 'Member Directory' }
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        <div className="flex gap-2">
          {/* Quick Add Team Button (Optional, also available via card) */}
          {activeTab === 'overview' && (
            <Button variant="outline" onClick={() => setShowAddTeamModal(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
              Add Team
            </Button>
          )}
          <Button onClick={() => setShowAssignModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Assign New Work
          </Button>
        </div>
      </div>

      {/* --- Tab 1: Teams Overview --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Render Teams from State */}
          {myTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img src={team.avatar} alt={team.lead} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <CardTitle className="text-base">{team.name}</CardTitle>
                      <p className="text-xs text-gray-500">Lead: {team.lead}</p>
                    </div>
                  </div>
                  <Badge variant="neutral" className="flex items-center">
                    <Users className="w-3 h-3 mr-1" /> {team.members}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">Current Workload</span>
                    <span className={`font-bold ${team.workload > 80 ? 'text-red-500' : 'text-green-600'}`}>
                      {team.workload}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${team.workload > 80 ? 'bg-red-500' : team.workload > 50 ? 'bg-blue-500' : 'bg-green-500'}`} 
                      style={{ width: `${team.workload}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Core Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {team.expertise.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowAssignModal(true)}>
                    Assign Task
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2">
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Team Card - Now Functional */}
          <div 
            onClick={() => setShowAddTeamModal(true)} // <--- ADDED CLICK HANDLER
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500 transition-all cursor-pointer min-h-[280px]"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110">
              <UserPlus className="w-6 h-6" />
            </div>
            <p className="font-medium">Create New Team</p>
          </div>
        </div>
      )}

      {/* --- Tab 2: Task Board --- */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <div key={status} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 min-h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700 text-sm flex items-center">
                  {status === 'To Do' && <Circle className="w-4 h-4 mr-2 text-gray-400" />}
                  {status === 'In Progress' && <Zap className="w-4 h-4 mr-2 text-amber-500" />}
                  {status === 'Done' && <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />}
                  {status}
                </h3>
                <span className="bg-white px-2 py-0.5 rounded text-xs border border-gray-200 text-gray-500">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {tasks.filter(t => t.status === status).map((task) => (
                  <div key={task.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={task.priority === 'High' ? 'danger' : 'neutral'} className="text-[10px] px-1.5">
                        {task.priority}
                      </Badge>
                      <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">{task.team}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] text-blue-700 font-bold">
                          {task.assignee.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-500 truncate max-w-[80px]">{task.assignee}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" /> {task.due}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Tab 3: Member Directory --- */}
      {activeTab === 'directory' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
            <CardTitle>All Members</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search skills or names..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Role & Team</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Skills</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{member.role}</p>
                      <p className="text-xs text-gray-500">{member.team}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={member.status === 'Available' ? 'success' : 'warning'}>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {member.skills.map(skill => (
                          <span key={skill} className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{skill}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">Message</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* --- MODAL 1: Assign Task --- */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Assign New Work</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Task Title" 
                placeholder="E.g., Review Patent Draft" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To Team</label>
                <select 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newTask.team}
                  onChange={(e) => setNewTask({...newTask, team: e.target.value})}
                >
                  <option value="">Select a Team...</option>
                  {myTeams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="flex gap-4">
                  {['Low', 'Medium', 'High'].map(p => (
                    <label key={p} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="priority" 
                        checked={newTask.priority === p} 
                        onChange={() => setNewTask({...newTask, priority: p})}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Textarea label="Instructions" placeholder="Add details..." rows={3} />
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              <Button onClick={handleAssignTask}>Assign Task</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Add New Team (NEW) --- */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Create New Team</h3>
              <button onClick={() => setShowAddTeamModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Team Name" 
                placeholder="E.g. Logistics & Operations" 
                value={newTeam.name}
                onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
              />
              <Input 
                label="Team Lead Name" 
                placeholder="E.g. John Doe" 
                value={newTeam.lead}
                onChange={(e) => setNewTeam({...newTeam, lead: e.target.value})}
              />
              <Input 
                label="Core Expertise (comma separated)" 
                placeholder="E.g. Supply Chain, Fleet Management" 
                value={newTeam.expertise}
                onChange={(e) => setNewTeam({...newTeam, expertise: e.target.value})}
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowAddTeamModal(false)}>Cancel</Button>
              <Button onClick={handleAddTeam}>Create Team</Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}