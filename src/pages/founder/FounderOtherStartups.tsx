import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Textarea } from '../../components/ui/Input';
import { 
  Users, 
  Globe, 
  Mail, 
  MessageSquare, 
  Edit, 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  Handshake
} from 'lucide-react';

// --- Mock Data ---
const initialMyProfile = {
  id: 's1',
  name: 'GreenField Tech',
  tagline: 'Precision IoT for Agriculture',
  description: 'We build soil sensors that help farmers save 30% water. Looking for drone partners for aerial mapping.',
  domain: 'AgriTech',
  lookingFor: ['Drone Hardware', 'Data Analytics Partners'],
  contactEmail: 'alex@greenfield.com',
  website: 'https://greenfield.com',
  showContact: true,
  openToCollab: true,
  logo: 'https://ui-avatars.com/api/?name=Green+Field&background=10B981&color=fff'
};

const otherStartupsData = [
  {
    id: 's2',
    name: 'MediDrone Systems',
    tagline: 'Autonomous Medical Delivery',
    description: 'Long-range drones for emergency supplies. We need better sensor integration for weather monitoring.',
    domain: 'Healthcare',
    lookingFor: ['IoT Sensors', 'Regulatory Advice'],
    contactEmail: 'sarah@skyhealth.com',
    website: 'https://medidrone.com',
    showContact: true,
    openToCollab: true,
    logo: 'https://ui-avatars.com/api/?name=Medi+Drone&background=3B82F6&color=fff'
  },
  {
    id: 's3',
    name: 'AutoBotics',
    tagline: 'Industrial Robotics Arms',
    description: 'Heavy-duty robotic arms for manufacturing lines.',
    domain: 'Robotics',
    lookingFor: ['AI Vision Software'],
    contactEmail: '', // Hidden
    website: 'https://autobotics.io',
    showContact: false,
    openToCollab: true,
    logo: 'https://ui-avatars.com/api/?name=Auto+Botics&background=EF4444&color=fff'
  },
  {
    id: 's4',
    name: 'VisionAI',
    tagline: 'Computer Vision API',
    description: 'Real-time object detection for edge devices. Works great with robotics and drones.',
    domain: 'AI/ML',
    lookingFor: ['Hardware Partners', 'Pilot Customers'],
    contactEmail: 'contact@visionai.com',
    website: 'https://visionai.com',
    showContact: true,
    openToCollab: true,
    logo: 'https://ui-avatars.com/api/?name=Vision+AI&background=8B5CF6&color=fff'
  }
];

export function FounderOtherStartups() {
  const [myProfile, setMyProfile] = useState(initialMyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'requests'

  // Filter Logic
  const filteredStartups = otherStartupsData.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.domain.toLowerCase().includes(search.toLowerCase()) ||
    s.lookingFor.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout role="founder" title="Ecosystem & Collaboration">
      
      {/* Top Banner: My Visibility Status */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <img src={myProfile.logo} alt="My Logo" className="w-12 h-12 rounded-lg" />
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              {myProfile.name}
              <Badge variant={myProfile.openToCollab ? 'success' : 'neutral'}>
                {myProfile.openToCollab ? 'Open to Collab' : 'Not Looking'}
              </Badge>
            </h3>
            <p className="text-sm text-gray-500">
              Your profile is <span className="font-semibold text-gray-700">Visible</span> to {otherStartupsData.length + 15} other founders.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} leftIcon={<Edit className="w-4 h-4" />}>
            Edit My Card
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Discover Startups</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, domain, or needs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => (
          <Card key={startup.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <img src={startup.logo} alt={startup.name} className="w-10 h-10 rounded-lg" />
                  <div>
                    <CardTitle className="text-base">{startup.name}</CardTitle>
                    <p className="text-xs text-gray-500">{startup.domain}</p>
                  </div>
                </div>
                {startup.openToCollab && (
                  <div className="bg-green-100 p-1.5 rounded-full text-green-600" title="Open to Collaboration">
                    <Handshake className="w-4 h-4" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">{startup.tagline}</p>
                <p className="text-sm text-gray-500 line-clamp-3 mb-3">{startup.description}</p>
                
                {startup.lookingFor.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Looking For:</p>
                    <div className="flex flex-wrap gap-1">
                      {startup.lookingFor.map(tag => (
                        <span key={tag} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex gap-2 text-sm text-gray-600">
                  {startup.website && (
                    <a href={startup.website} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-600 transition-colors">
                      <Globe className="w-3 h-3 mr-1" /> Website
                    </a>
                  )}
                  {startup.showContact ? (
                    <a href={`mailto:${startup.contactEmail}`} className="flex items-center hover:text-blue-600 transition-colors">
                      <Mail className="w-3 h-3 mr-1" /> {startup.contactEmail}
                    </a>
                  ) : (
                    <span className="flex items-center text-gray-400 cursor-not-allowed" title="Contact hidden by startup">
                      <EyeOff className="w-3 h-3 mr-1" /> Contact Hidden
                    </span>
                  )}
                </div>
                <Button className="w-full" variant="secondary" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  Propose Collaboration
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Edit My Profile Modal --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Edit Public Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 mb-2">
                This information will be visible to all other startups in the ARTPark ecosystem.
              </div>

              <Input 
                label="Tagline" 
                value={myProfile.tagline} 
                onChange={(e) => setMyProfile({...myProfile, tagline: e.target.value})}
              />
              
              <Textarea 
                label="Description & Goals" 
                value={myProfile.description}
                onChange={(e) => setMyProfile({...myProfile, description: e.target.value})}
                rows={3}
                helperText="Describe what you do and what kind of partners you are looking for."
              />

              <Input 
                label="Public Website" 
                value={myProfile.website}
                onChange={(e) => setMyProfile({...myProfile, website: e.target.value})}
              />

              <div className="flex flex-col space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <Handshake className="w-4 h-4 mr-2 text-green-600" />
                    Open to Collaboration?
                  </span>
                  <input 
                    type="checkbox" 
                    checked={myProfile.openToCollab}
                    onChange={(e) => setMyProfile({...myProfile, openToCollab: e.target.checked})}
                    className="w-4 h-4 text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    {myProfile.showContact ? <Eye className="w-4 h-4 mr-2 text-blue-600" /> : <EyeOff className="w-4 h-4 mr-2 text-gray-400" />}
                    Show Contact Email Publicly
                  </span>
                  <input 
                    type="checkbox" 
                    checked={myProfile.showContact}
                    onChange={(e) => setMyProfile({...myProfile, showContact: e.target.checked})}
                    className="w-4 h-4 text-blue-600"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={() => setIsEditing(false)}>Save Profile</Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}