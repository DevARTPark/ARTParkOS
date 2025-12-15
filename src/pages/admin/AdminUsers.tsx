import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Shield, 
  MoreHorizontal,
  Briefcase,
  Activity,
  Trash2
} from 'lucide-react';

// --- Mock Data ---

const reviewers = [
  { id: 1, name: 'Amit Patel', role: 'Program Manager', load: 'High', activeReviews: 12, cohorts: ['Robotics', 'AI'], status: 'Active', email: 'amit@artpark.in' },
  { id: 2, name: 'Sarah Lee', role: 'Technical Lead', load: 'Medium', activeReviews: 5, cohorts: ['MedTech'], status: 'Active', email: 'sarah@artpark.in' },
  { id: 3, name: 'Dr. Rao', role: 'Senior Reviewer', load: 'Low', activeReviews: 2, cohorts: ['AgriTech'], status: 'On Leave', email: 'rao@artpark.in' },
];

const founders = [
  { id: 1, name: 'Alex Chen', startup: 'GreenField Tech', email: 'alex@greenfield.com', joined: 'Jan 2023', status: 'Active' },
  { id: 2, name: 'Priya Mehta', startup: 'MediDrone', email: 'priya@medidrone.com', joined: 'Feb 2023', status: 'Active' },
  { id: 3, name: 'John Doe', startup: 'Stealth AI', email: 'john@stealth.ai', joined: 'Oct 2023', status: 'Suspended' },
];

const invites = [
  { id: 1, email: 'founder@newtech.io', role: 'Founder', sent: '2 days ago', status: 'Pending' },
  { id: 2, email: 'expert@iisc.ac.in', role: 'Reviewer', sent: '5 days ago', status: 'Pending' },
];

export function AdminUsers() {
  const [activeTab, setActiveTab] = useState('reviewers');
  const [search, setSearch] = useState('');

  return (
    <DashboardLayout role="admin" title="User Governance">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Tabs 
          tabs={[
            { id: 'reviewers', label: 'Program Team' },
            { id: 'founders', label: 'Founders' },
            { id: 'invites', label: 'Pending Invites' },
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <Button leftIcon={<UserPlus className="w-4 h-4" />}>
            Invite User
          </Button>
        </div>
      </div>

      {/* --- Tab 1: Reviewers (Program Team) --- */}
      {activeTab === 'reviewers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviewers.map((r) => (
              <Card key={r.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{r.name}</h3>
                        <p className="text-xs text-gray-500">{r.role}</p>
                      </div>
                    </div>
                    <Badge variant={r.status === 'Active' ? 'success' : 'warning'}>{r.status}</Badge>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Load</span>
                      <span className={`font-medium ${
                        r.load === 'High' ? 'text-red-600' : r.load === 'Medium' ? 'text-amber-600' : 'text-green-600'
                      }`}>{r.activeReviews} Startups</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cohorts</span>
                      <span className="text-gray-900">{r.cohorts.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="w-full">Reassign</Button>
                    <Button size="sm" className="w-full">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* --- Tab 2: Founders --- */}
      {activeTab === 'founders' && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Founder Name</th>
                  <th className="px-6 py-4">Startup Entity</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {founders.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{f.name}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {f.startup}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{f.email}</td>
                    <td className="px-6 py-4 text-gray-500">{f.joined}</td>
                    <td className="px-6 py-4">
                      <Badge variant={f.status === 'Active' ? 'success' : 'danger'}>{f.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* --- Tab 3: Invites --- */}
      {activeTab === 'invites' && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invites.map((i) => (
                <div key={i.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Mail className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{i.email}</p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>Role: {i.role}</span>
                        <span>•</span>
                        <span>Sent: {i.sent}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">Resend</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </DashboardLayout>
  );
}