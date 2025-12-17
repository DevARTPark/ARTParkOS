import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Textarea } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';

// 1. IMPORT DATA FROM NEW FILE
import { initialMyProfile, otherStartupsData, incomingRequestsData } from '../../data/ecosystemData';

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
  Handshake,
  ArrowRight,
  CheckCircle2,
  X,
  Building2
} from 'lucide-react';

export function FounderOtherStartups() {
  const [myProfile, setMyProfile] = useState(initialMyProfile);
  const [activeTab, setActiveTab] = useState('browse');
  const [search, setSearch] = useState('');
  
  // Modals State
  const [isEditing, setIsEditing] = useState(false);
  const [proposalTarget, setProposalTarget] = useState<any>(null);
  const [viewStartup, setViewStartup] = useState<any>(null);
  
  // Proposal Form State
  const [proposalMessage, setProposalMessage] = useState('');

  // Filter Logic
  const filteredStartups = otherStartupsData.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.domain.toLowerCase().includes(search.toLowerCase()) ||
    s.lookingFor.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSendProposal = () => {
    // In a real app, this would trigger an API call and update the notification system
    alert(`Proposal sent to ${proposalTarget.name}! They will be notified.`);
    setProposalTarget(null);
    setProposalMessage('');
  };

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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Tabs 
          tabs={[
            { id: 'browse', label: 'Discover Startups' },
            { id: 'requests', label: 'Collaboration Requests' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        
        {activeTab === 'browse' && (
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
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
          </div>
        )}
      </div>

      {/* --- Browse Tab --- */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <Card key={startup.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img src={startup.logo} alt={startup.name} className="w-10 h-10 rounded-lg" />
                    <div>
                      <CardTitle className="text-base cursor-pointer hover:text-blue-600" onClick={() => setViewStartup(startup)}>
                        {startup.name}
                      </CardTitle>
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
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{startup.description}</p>
                  
                  {startup.lookingFor.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Looking For:</p>
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

                <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" onClick={() => setViewStartup(startup)}>
                    View Details
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setProposalTarget(startup)}
                    leftIcon={<MessageSquare className="w-3 h-3" />}
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- Incoming Requests Tab --- */}
      {activeTab === 'requests' && (
        <Card>
          <CardHeader>
            <CardTitle>Collaboration Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {incomingRequestsData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No new requests.</p>
            ) : (
              <div className="space-y-4">
                {incomingRequestsData.map(req => (
                  <div key={req.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <img src={req.logo} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{req.fromStartup}</h4>
                          <span className="text-xs text-gray-400">• {req.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 max-w-xl">{req.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">Decline</Button>
                      <Button size="sm" leftIcon={<Handshake className="w-4 h-4" />}>Accept & Chat</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- Modal 1: Edit My Profile --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Edit Public Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
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

      {/* --- Modal 2: Send Proposal --- */}
      {proposalTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-lg flex items-center">
                <Handshake className="w-5 h-5 mr-2 text-blue-600" />
                Collaborate with {proposalTarget.name}
              </h3>
              <button onClick={() => setProposalTarget(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                Sending this proposal will notify <strong>{proposalTarget.name}</strong> immediately.
              </div>
              <Textarea 
                label="Message / Proposal" 
                placeholder={`Hi ${proposalTarget.name}, we are working on... and think we could collaborate on...`}
                rows={5}
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setProposalTarget(null)}>Cancel</Button>
              <Button onClick={handleSendProposal} leftIcon={<Mail className="w-4 h-4" />}>
                Send Proposal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal 3: View Startup Details --- */}
      {viewStartup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700">
              <button 
                onClick={() => setViewStartup(null)} 
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
              <div className="absolute -bottom-10 left-8">
                <img src={viewStartup.logo} alt="" className="w-20 h-20 rounded-xl border-4 border-white shadow-lg" />
              </div>
            </div>
            
            <div className="pt-14 px-8 pb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewStartup.name}</h2>
                  <p className="text-blue-600 font-medium">{viewStartup.tagline}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="neutral">{viewStartup.domain}</Badge>
                  <Badge variant="success">{viewStartup.stage}</Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600 leading-relaxed">{viewStartup.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-bold text-gray-700 text-sm mb-2 flex items-center">
                      <Search className="w-4 h-4 mr-2" /> Looking For
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {viewStartup.lookingFor.map((item: string) => (
                        <Badge key={item} variant="info">{item}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-bold text-gray-700 text-sm mb-2 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" /> Contact Info
                    </h5>
                    <div className="space-y-2 text-sm">
                      {viewStartup.website && (
                        <a href={viewStartup.website} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
                          <Globe className="w-3 h-3 mr-2" /> {viewStartup.website}
                        </a>
                      )}
                      {viewStartup.showContact ? (
                        <a href={`mailto:${viewStartup.contactEmail}`} className="flex items-center text-gray-600 hover:text-gray-900">
                          <Mail className="w-3 h-3 mr-2" /> {viewStartup.contactEmail}
                        </a>
                      ) : (
                        <span className="flex items-center text-gray-400 italic">
                          <EyeOff className="w-3 h-3 mr-2" /> Private Contact
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <Button 
                  onClick={() => { setViewStartup(null); setProposalTarget(viewStartup); }}
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                >
                  Send Collaboration Proposal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}