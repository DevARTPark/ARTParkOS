import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { AIRLRadarChart } from '../../components/charts/AIRLRadarChart';
import { actionItems, facilities, mentors, reviews, projects, currentUser } from '../../data/mockData';
// --- FIXED IMPORT BELOW: Added CheckCircle2 ---
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  ExternalLink, 
  FileText, 
  MapPin, 
  Plus, 
  Users, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export function FounderDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('open');
  const [showActionModal, setShowActionModal] = useState(false);
  
  // Initialize state with mock data
  const [myActions, setMyActions] = useState(actionItems); 
  const [chartSelection, setChartSelection] = useState<string>('all');
  
  const [newAction, setNewAction] = useState({
    title: '',
    priority: 'medium',
    dueDate: ''
  });
  const categories = ['Technology', 'Product', 'Market Research', 'Organisation', 'Target Market'];
  const projectScores: Record<string, Record<string, number>> = {
    'p1': { 'Technology': 3, 'Product': 4, 'Market Research': 3, 'Organisation': 4, 'Target Market': 3 }, // AgriSense
    'p2': { 'Technology': 5, 'Product': 6, 'Market Research': 5, 'Organisation': 5, 'Target Market': 6 }  // MediDrone
  };

  const currentChartData = React.useMemo(() => {
    if (chartSelection === 'all') {
      // OVERALL VIEW: Calculates the MINIMUM score across all projects
      // This highlights the "weakest links" in the startup's overall portfolio
      return categories.map(cat => {
        const scores = projects.map(p => projectScores[p.id]?.[cat] || 0);
        const minScore = Math.min(...scores);
        return { subject: cat, A: minScore, fullMark: 9 };
      });
    } else {
      // PROJECT VIEW: Specific scores
      const scores = projectScores[chartSelection];
      if (!scores) return [];
      return categories.map(cat => ({ subject: cat, A: scores[cat], fullMark: 9 }));
    }
  }, [chartSelection]);
  const displayLevel = Math.floor(currentChartData.reduce((acc, curr) => acc + curr.A, 0) / 5) || 0;

  const currentProject = projects[0];

  // --- Handlers ---

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    const action: any = {
      id: `new-${Date.now()}`,
      title: newAction.title,
      status: 'open', // New items default to 'Open' tab
      priority: newAction.priority,
      dueDate: newAction.dueDate || new Date().toISOString().split('T')[0]
    };
    
    setMyActions([action, ...myActions]); // Add to top of list
    setShowActionModal(false); // Close modal
    setNewAction({ title: '', priority: 'medium', dueDate: '' }); // Reset form
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setMyActions(prevActions => 
      prevActions.map(action => 
        action.id === id ? { ...action, status: newStatus } : action
      )
    );
  };

  // --- Animation Variants ---
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout role="founder" title={`Welcome back, ${currentUser.name.split(' ')[0]}`}>
      
      {/* Project Selector Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentProject.name}
          </h2>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {currentProject.domain}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Founded{' '}
              {currentProject.foundedDate}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="text-right mr-4">
            <p className="text-sm text-gray-500">Current Level</p>
            <p className="text-3xl font-bold text-blue-600">
              AIRL {currentProject.currentAIRL}
            </p>
          </div>
          <Button onClick={() => window.location.href = '/founder/assessment'}>
            Continue Assessment <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AIRL Status Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>AIRL Status Overview</CardTitle>
              
              {/* Project Selector Dropdown */}
              <div className="w-48">
                <select 
                  className="w-full text-xs bg-white border border-gray-200 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-gray-700"
                  value={chartSelection}
                  onChange={(e) => setChartSelection(e.target.value)}
                >
                  <option value="all">Startup Aggregate (Min)</option>
                  <option disabled>──────────</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center">
                {/* Radar Chart Area */}
                <div className="w-full md:w-1/2">
                  <AIRLRadarChart data={currentChartData} />
                </div>

                {/* Info Sidebar */}
                <div className="w-full md:w-1/2 mt-4 md:mt-0 pl-0 md:pl-6">
                  
                  {/* Dynamic Level Badge */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-[10px] text-blue-600 font-bold uppercase mb-1 tracking-wider">
                      {chartSelection === 'all' ? 'Aggregate Maturity' : 'Project Maturity'}
                    </p>
                    <div className="flex items-end gap-2">
                      <h3 className="text-3xl font-bold text-blue-900">AIRL {displayLevel}</h3>
                      <span className="text-sm text-blue-600 mb-1 font-medium">
                        {chartSelection === 'all' ? '(Conservative)' : '(Current)'}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-4 text-sm">
                    {chartSelection === 'all' ? 'Critical Gaps (Lowest Areas)' : 'Current Status'}
                  </h4>
                  
                  {/* Dynamic Milestones List */}
                  <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                    {currentChartData.slice(0, 2).map((dataPoint) => (
                      <div key={dataPoint.subject} className="relative pl-6">
                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ${dataPoint.A >= 5 ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <p className="text-sm font-medium text-gray-900">
                          {dataPoint.subject}
                        </p>
                        <p className="text-xs text-gray-500">
                          Score: {dataPoint.A} / 9
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Items Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Action Items</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowActionModal(true)}>
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs 
                tabs={[
                  { id: 'open', label: 'Open' },
                  { id: 'in_progress', label: 'In Progress' },
                  { id: 'done', label: 'Done' }
                ]} 
                activeTab={activeTab} 
                onChange={setActiveTab} 
                className="mb-4" 
              />
              
              <div className="space-y-3">
                {myActions.filter(i => i.status === activeTab).map(action => (
                  <div 
                    key={action.id} 
                    className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-medium ${action.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {action.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due: {action.dueDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={
                        action.priority === 'high' ? 'danger' : 
                        action.priority === 'medium' ? 'warning' : 
                        'success'
                      }>
                        {action.priority}
                      </Badge>

                      {/* --- Action Buttons --- */}
                      
                      {activeTab === 'open' && (
                        <button 
                          onClick={() => handleStatusChange(action.id, 'in_progress')}
                          className="p-1.5 rounded-full hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Start Task"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {activeTab === 'in_progress' && (
                        <button 
                          onClick={() => handleStatusChange(action.id, 'done')}
                          className="p-1.5 rounded-full hover:bg-green-100 text-gray-400 hover:text-green-600 transition-colors"
                          title="Mark as Done"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {activeTab === 'done' && (
                         <div className="p-1.5">
                           <CheckCircle2 className="w-4 h-4 text-green-500" />
                         </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {myActions.filter(i => i.status === activeTab).length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    {activeTab === 'open' && "No pending tasks."}
                    {activeTab === 'in_progress' && "No tasks in progress."}
                    {activeTab === 'done' && "No completed tasks."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Facilities Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Facilities & Labs</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/founder/facilities')}
              >
                Book New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilities.slice(0, 2).map(facility => (
                  <div key={facility.id} className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg">
                    <img src={facility.image} alt={facility.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {facility.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        <Badge variant={facility.availability === 'available' ? 'success' : 'neutral'}>
                          {facility.availability}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2 capitalize">
                          {facility.type}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/founder/facilities/${facility.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mentors Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mentors & Experts</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/founder/mentors')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentors.map(mentor => (
                  <div key={mentor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={mentor.image} alt={mentor.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {mentor.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {mentor.role} • {mentor.domain}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => navigate(`/founder/mentors/${mentor.id}`)}
                    >
                      Request
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews Widget */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reviews & Documents</CardTitle>
              <Button onClick={() => navigate('/founder/reviews')}>
                Submit Review
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Project</th>
                      <th className="px-4 py-3">AIRL Level</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Deadline</th>
                      <th className="px-4 py-3 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {review.projectName}
                        </td>
                        <td className="px-4 py-3">AIRL {review.airlLevel}</td>
                        <td className="px-4 py-3">
                          <Badge variant={review.status === 'completed' ? 'success' : 'warning'}>
                            {review.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {review.deadline}
                        </td>
                        <td className="px-4 py-3">
                          {/* UPDATED BUTTON */}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate('/founder/reviews')}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Add Action Item Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Add Action Item"
        size="sm"
      >
        <form onSubmit={handleAddAction} className="space-y-4">
          <Input 
            label="Action Description" 
            placeholder="e.g. Upload Pitch Deck"
            value={newAction.title}
            onChange={(e) => setNewAction({...newAction, title: e.target.value})}
            required
          />
          
          <Select
            label="Priority"
            value={newAction.priority}
            onChange={(e) => setNewAction({...newAction, priority: e.target.value})}
            options={[
              { value: 'high', label: 'High (Red)' },
              { value: 'medium', label: 'Medium (Yellow)' },
              { value: 'low', label: 'Low (Green)' }
            ]}
          />

          <Input 
            label="Deadline" 
            type="date"
            value={newAction.dueDate}
            onChange={(e) => setNewAction({...newAction, dueDate: e.target.value})}
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Action
            </Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}