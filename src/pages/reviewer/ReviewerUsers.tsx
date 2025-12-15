import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { 
  Search, 
  Mail, 
  Phone, 
  Linkedin, 
  Briefcase, 
  MapPin, 
  User,
  Filter
} from 'lucide-react';

// --- Mock Data: People Directory ---
const peopleData = [
  // Founders
  {
    id: 'u1',
    name: 'Alex Chen',
    role: 'Founder',
    organization: 'GreenField Tech',
    domain: 'AgriTech',
    email: 'alex@greenfield.com',
    phone: '+91 98765 43210',
    status: 'Active',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=10B981&color=fff'
  },
  {
    id: 'u2',
    name: 'Sarah Jenkins',
    role: 'CTO',
    organization: 'MediDrone Systems',
    domain: 'Robotics',
    email: 'sarah@medidrone.com',
    phone: '+91 98765 11223',
    status: 'Active',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=3B82F6&color=fff'
  },
  // Mentors
  {
    id: 'm1',
    name: 'Dr. Priya Sharma',
    role: 'Mentor',
    organization: 'IISc / Independent',
    domain: 'Robotics & AI',
    email: 'priya.sharma@iisc.edu',
    phone: '+91 99887 77665',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'm2',
    name: 'Rahul Verma',
    role: 'Mentor',
    organization: 'Venture Catalysts',
    domain: 'Business Strategy',
    email: 'rahul.v@vc.com',
    phone: '+91 88776 66554',
    status: 'Busy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  // Reviewers (Colleagues)
  {
    id: 'r1',
    name: 'Amit Patel',
    role: 'Reviewer',
    organization: 'ARTPark Innovation Team',
    domain: 'Program Manager',
    email: 'amit@artpark.in',
    phone: '+91 77665 55443',
    status: 'Active',
    avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=0F172A&color=fff'
  }
];

export function ReviewerUsers() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  // Filter Logic
  const filteredPeople = peopleData.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(search.toLowerCase()) || 
                          person.organization.toLowerCase().includes(search.toLowerCase()) ||
                          person.domain.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'founders') return matchesSearch && (person.role === 'Founder' || person.role === 'CTO');
    if (activeTab === 'mentors') return matchesSearch && person.role === 'Mentor';
    if (activeTab === 'reviewers') return matchesSearch && person.role === 'Reviewer';
    
    return matchesSearch;
  });

  return (
    <DashboardLayout role="reviewer" title="People Directory">
      
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Tabs 
          tabs={[
            { id: 'all', label: 'All People' },
            { id: 'founders', label: 'Founders' },
            { id: 'mentors', label: 'Mentors & Experts' },
            { id: 'reviewers', label: 'Internal Team' },
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search name, skill, or startup..." 
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

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeople.map((person) => (
          <Card key={person.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900">{person.name}</h3>
                    <p className="text-xs text-gray-500">{person.role}</p>
                  </div>
                </div>
                <Badge variant={person.status === 'Active' || person.status === 'Available' ? 'success' : 'neutral'}>
                  {person.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="font-medium">{person.organization}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{person.domain}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                  <span>Bangalore, IN</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <a href={`mailto:${person.email}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" leftIcon={<Mail className="w-3 h-3" />}>
                    Email
                  </Button>
                </a>
                <Button variant="ghost" size="sm" className="px-3 text-blue-600 hover:bg-blue-50">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="px-3 text-gray-600 hover:bg-gray-100">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty State */}
        {filteredPeople.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No users found matching your search.
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}