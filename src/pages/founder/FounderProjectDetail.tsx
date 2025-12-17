import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Textarea } from '../../components/ui/Input';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { 
  Pencil, 
  Save, 
  X, 
  Target, 
  TrendingUp, 
  Calendar, 
  Users, 
  Rocket,
  ArrowRight,
  ExternalLink,
  Wallet
} from 'lucide-react';

// Import mock data to find the specific project
import { projects } from '../../data/mockData';

export function FounderProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Find the project matching the ID from the URL (e.g., "project1")
  // If not found, default to the first one to prevent crashing
  const projectData = projects.find(p => p.id === id) || projects[0];

  // 2. Local state for "Edit Mode"
  const [isEditing, setIsEditing] = useState(false);
  
  // 3. State for the form fields (pre-filled with mock data)
  const [details, setDetails] = useState({
    name: projectData.name,
    domain: projectData.domain,
    description: projectData.description,
    foundedDate: projectData.foundedDate,
    teamSize: '8', // Mock additional data
    website: 'https://www.artpark.in', // Mock additional data
    stage: 'Pilot'
  });

  // 4. Mock Funding Data (Specific to this page for now)
  const funding = {
    raised: '₹45.0 L',
    grant: '₹25.0 L',
    equity: '₹20.0 L',
    runway: '8 Months',
    burnRate: '₹3.5 L/mo'
  };

  const handleSave = () => {
    // In a real app, you would make an API call here
    console.log("Saved details:", details);
    setIsEditing(false);
  };

  return (
    <DashboardLayout role="founder" title="Project Details">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="flex flex-col gap-3 w-full max-w-lg">
               <label className="text-xs font-bold text-gray-500 uppercase">Project Name</label>
               <Input 
                 value={details.name} 
                 onChange={(e) => setDetails({...details, name: e.target.value})} 
                 className="text-lg font-bold"
               />
               <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Domain</label>
                    <Input 
                      value={details.domain} 
                      onChange={(e) => setDetails({...details, domain: e.target.value})} 
                    />
                 </div>
                 <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Founded</label>
                    <Input 
                      type="date"
                      value={details.foundedDate} 
                      onChange={(e) => setDetails({...details, foundedDate: e.target.value})} 
                    />
                 </div>
               </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{details.name}</h1>
                <Badge variant="neutral">{details.domain}</Badge>
                <Badge variant="success">{details.stage}</Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" /> 
                  Founded: <span className="text-gray-900 font-medium">{details.foundedDate}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" /> 
                  Team: <span className="text-gray-900 font-medium">{details.teamSize}</span>
                </span>
                <a href={details.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                  Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 self-start md:self-center">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)} leftIcon={<X className="w-4 h-4" />}>
                Cancel
              </Button>
              <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} leftIcon={<Pencil className="w-4 h-4" />}>
              Edit Details
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Left Column: Overview & Financials --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>About the Project</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea 
                  value={details.description}
                  onChange={(e) => setDetails({...details, description: e.target.value})}
                  rows={6}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-base">
                  {details.description}
                </p>
              )}
            </CardContent>
          </Card>

          {/* 2. Financial Health Card */}
          <Card className="border-t-4 border-t-green-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-600" /> 
                Funding & Financials
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                Manage Finances <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-green-50 rounded-xl mb-6">
                <div>
                   <p className="text-[10px] text-green-600 uppercase font-bold tracking-wider">Total Raised</p>
                   <p className="text-2xl font-bold text-gray-900 mt-1">{funding.raised}</p>
                </div>
                <div>
                   <p className="text-[10px] text-green-600 uppercase font-bold tracking-wider">Grants</p>
                   <p className="text-2xl font-bold text-gray-900 mt-1">{funding.grant}</p>
                </div>
                <div>
                   <p className="text-[10px] text-red-500 uppercase font-bold tracking-wider">Burn Rate</p>
                   <p className="text-2xl font-bold text-red-600 mt-1">{funding.burnRate}</p>
                </div>
                <div>
                   <p className="text-[10px] text-green-600 uppercase font-bold tracking-wider">Runway</p>
                   <p className="text-2xl font-bold text-green-700 mt-1">{funding.runway}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Grant Utilization</span>
                  <span className="font-bold text-gray-900">60%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full shadow-sm" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">₹15.0 L deployed of ₹25.0 L</p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* --- Right Column: AIRL & Actions --- */}
        <div className="space-y-6">
          
          {/* 3. AIRL Status Card */}
          <Card className="border-t-4 border-t-blue-600 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                AIRL Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 mb-6">
                 <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-blue-50 bg-white shadow-inner">
                    <div className="text-center">
                       <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">LEVEL</p>
                       <p className="text-5xl font-extrabold text-blue-600">{projectData.currentAIRL}</p>
                    </div>
                 </div>
                 <p className="mt-4 font-medium text-gray-900">Proof of Concept</p>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                       <span className="font-medium text-gray-600">Progress to Level {projectData.currentAIRL + 1}</span>
                       <span className="text-blue-600 font-bold">65%</span>
                    </div>
                    <ProgressBar value={65} />
                 </div>
                 
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800 font-bold mb-2 flex items-center">
                       <Target className="w-4 h-4 mr-2" /> Next Milestone
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                       Submit user testing data for 50+ beta users to unlock <strong>Level {projectData.currentAIRL + 1}</strong>.
                    </p>
                 </div>

                 <Button 
                   className="w-full h-12 text-base shadow-blue-200 shadow-lg mt-2" 
                   onClick={() => navigate('/founder/assessment')}
                 >
                   Update Assessment <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
              </div>
            </CardContent>
          </Card>

          {/* 4. Quick Stats */}
          <Card>
             <CardContent className="p-0">
                <div className="flex divide-x divide-gray-100">
                   <div className="flex-1 p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-xs text-gray-500 font-medium">Mentors</p>
                   </div>
                   <div className="flex-1 p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <p className="text-2xl font-bold text-gray-900">4</p>
                      <p className="text-xs text-gray-500 font-medium">Labs Booked</p>
                   </div>
                   <div className="flex-1 p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <p className="text-2xl font-bold text-gray-900">3</p>
                      <p className="text-xs text-gray-500 font-medium">Patents</p>
                   </div>
                </div>
             </CardContent>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
}