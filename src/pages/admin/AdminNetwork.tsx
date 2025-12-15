import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { 
  Users, 
  Building2, 
  Star, 
  Handshake, 
  Search, 
  Plus,
  Landmark,
  Globe,
  FileText
} from 'lucide-react';

// --- Mock Data ---

// 1. Mentors (Strategic Level)
const mentorsList = [
  { id: 1, name: 'Dr. Priya Sharma', domain: 'Robotics & AI', role: 'Chairperson, IISc Robotics', impact: 'High', startups: 6, status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Rahul Verma', domain: 'GTM Strategy', role: 'Ex-MD, Sequoia India', impact: 'Medium', startups: 3, status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Amitabh Das', domain: 'IP Law', role: 'Partner, Shardul Amarchand', impact: 'Low', startups: 2, status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
];

// 2. Corporate Partners
const partnersList = [
  { id: 1, name: 'Cisco', type: 'CSR & Tech', contribution: '₹5Cr Grant + 5G Lab', outcome: 'Est. 5G Center of Excellence', status: 'Platinum' },
  { id: 2, name: 'Narayana Health', type: 'Clinical Pilot', contribution: 'Hospital Access', outcome: 'Validation for 3 MedTech Startups', status: 'Gold' },
  { id: 3, name: 'Google Cloud', type: 'Infrastructure', contribution: '$100k Credits/Startup', outcome: 'Reduced Portfolio Burn Rate', status: 'Gold' },
];

// 3. Strategic Alliances (NEW - Replaces Facilities)
const alliancesList = [
  { id: 1, name: 'Dept. of Science & Tech (DST)', type: 'Government', focus: 'Policy & Grants', status: 'Active', outcome: '₹100Cr Corpus Fund' },
  { id: 2, name: 'IISc Bangalore', type: 'Academia', focus: 'DeepTech Research', status: 'Active', outcome: 'IP Sharing Framework' },
  { id: 3, name: 'World Bank', type: 'Global NGO', focus: 'Rural Impact', status: 'MOU Draft', outcome: 'Pilot in 50 Villages' },
  { id: 4, name: 'Start-up India', type: 'Government', focus: 'Regulatory Sandbox', status: 'Active', outcome: 'Fast-track Patent Processing' },
];

export function AdminNetwork() {
  const [activeTab, setActiveTab] = useState('partners');
  const [search, setSearch] = useState('');

  return (
    <DashboardLayout role="admin" title="Strategic Network & Ecosystem">
      
      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Tabs 
          tabs={[
            { id: 'partners', label: 'Corporate Partners' },
            { id: 'alliances', label: 'Strategic Alliances' }, // Replaced Facilities
            { id: 'mentors', label: 'Mentor Board' },
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Add New
          </Button>
        </div>
      </div>

      {/* --- Tab 1: Corporate Partners --- */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {partnersList.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
            <Card key={p.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-600">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.type}</p>
                  </div>
                  <Badge variant={p.status === 'Platinum' ? 'default' : p.status === 'Gold' ? 'warning' : 'neutral'}>
                    {p.status}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Contribution</p>
                    <p className="text-sm font-medium text-gray-800">{p.contribution}</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Handshake className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Strategic Outcome</p>
                      <p className="text-sm font-medium text-gray-900">{p.outcome}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                  <Button className="w-full" variant="outline" size="sm">View MOU</Button>
                  <Button className="w-full" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- Tab 2: Strategic Alliances (Govt/Academia) --- */}
      {activeTab === 'alliances' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-orange-50 border-orange-100">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-orange-600 uppercase">Govt Bodies</p>
                  <h3 className="text-2xl font-bold text-orange-900 mt-1">12</h3>
                </div>
                <Landmark className="w-8 h-8 text-orange-300" />
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase">Academic Partners</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">8</h3>
                </div>
                <Building2 className="w-8 h-8 text-blue-300" />
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase">Global NGOs</p>
                  <h3 className="text-2xl font-bold text-purple-900 mt-1">5</h3>
                </div>
                <Globe className="w-8 h-8 text-purple-300" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Key Focus Area</th>
                    <th className="px-6 py-4">Primary Outcome</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Documents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {alliancesList.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                        {a.type === 'Government' ? <Landmark className="w-4 h-4 text-gray-400" /> : 
                         a.type === 'Academia' ? <Building2 className="w-4 h-4 text-gray-400" /> : 
                         <Globe className="w-4 h-4 text-gray-400" />}
                        {a.name}
                      </td>
                      <td className="px-6 py-4">{a.type}</td>
                      <td className="px-6 py-4 text-gray-600">{a.focus}</td>
                      <td className="px-6 py-4 font-medium text-blue-700">{a.outcome}</td>
                      <td className="px-6 py-4">
                        <Badge variant={a.status === 'Active' ? 'success' : 'warning'}>{a.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="ghost" className="text-gray-500 hover:text-blue-600">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Tab 3: Mentor Board --- */}
      {activeTab === 'mentors' && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Mentor</th>
                  <th className="px-6 py-4">Profile/Role</th>
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">Strategic Impact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mentorsList.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <img src={m.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      {m.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{m.role}</td>
                    <td className="px-6 py-4 text-gray-500">{m.domain}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        m.impact === 'High' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {m.impact} Impact
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={m.status === 'Active' ? 'success' : 'neutral'}>{m.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="ghost">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

    </DashboardLayout>
  );
}