import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { 
  User, 
  Bell, 
  Shield, 
  Sun, 
  Moon, 
  Monitor, 
  Clock, 
  Calendar as CalendarIcon,
  Mail,
  Sliders
} from 'lucide-react';

export function ReviewerSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // --- Dark Mode Logic ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <DashboardLayout role="reviewer" title="Reviewer Settings">
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <Card>
            <CardContent className="p-2">
              {[
                { id: 'profile', label: 'My Profile', icon: User },
                { id: 'preferences', label: 'Review Preferences', icon: Sliders },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'appearance', label: 'Appearance', icon: Sun },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* --- 1. My Profile --- */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src="https://ui-avatars.com/api/?name=Amit+Patel&background=0F172A&color=fff" 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full border-2 border-gray-100" 
                    />
                    <div>
                      <Button variant="outline" size="sm" className="mb-1">Upload New Photo</Button>
                      <p className="text-xs text-gray-500">Recommended size: 400x400px</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue="Amit Patel" />
                    <Input label="Email Address" defaultValue="amit@artpark.in" disabled />
                    <Input label="Job Title" defaultValue="Senior Program Manager" />
                    <Input label="Department" defaultValue="Innovation & Grants" />
                  </div>
                  <Textarea label="Bio (Internal)" defaultValue="Focusing on Robotics and Autonomous Systems startups. Handling AIRL 4-7 progression." rows={2} />
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button>Save Profile</Button>
              </div>
            </div>
          )}

          {/* --- 2. Review Preferences (New) --- */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Availability & Scheduling</CardTitle>
                  <p className="text-sm text-gray-500">Configure how startups can book reviews with you.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                      <div className="flex gap-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                          <button key={i} className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center border transition-colors ${i < 5 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                        <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Review Duration</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                        <option>30 Minutes</option>
                        <option selected>60 Minutes</option>
                        <option>90 Minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Between Meetings</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                        <option>None</option>
                        <option selected>15 Minutes</option>
                        <option>30 Minutes</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grading Defaults</CardTitle>
                </CardHeader>
                <CardContent>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="text-blue-600 rounded" />
                    <span className="text-sm text-gray-700">Auto-save grading drafts every 2 minutes</span>
                  </label>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button>Update Preferences</Button>
              </div>
            </div>
          )}

          {/* --- 3. Notifications --- */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> Email Alerts
                  </h4>
                  <div className="space-y-3">
                    {[
                      'New Assessment Submitted for Review',
                      'Startup uploads Monthly Report',
                      'Comment reply from Founder',
                      'Daily Digest: Upcoming Reviews',
                      'Red Flag Alerts (Critical)'
                    ].map((item, i) => (
                      <label key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                        <span className="text-sm text-gray-700">{item}</span>
                        <input type="checkbox" defaultChecked={i !== 2} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- 4. Security --- */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader><CardTitle>Account Security</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Password</p>
                    <p className="text-xs text-gray-500">Last changed: 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">2-Step Verification</p>
                    <p className="text-xs text-gray-500">Currently inactive</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- 5. Appearance --- */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader><CardTitle>Theme Preferences</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="p-3 bg-white rounded-full shadow-sm mb-2"><Sun className="w-5 h-5 text-orange-500" /></div>
                    <span className="text-sm font-medium text-gray-900">Light Mode</span>
                  </button>

                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center p-4 rounded-xlpK border-2 transition-all ${
                      theme === 'dark' ? 'border-blue-600 bg-slate-800' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="p-3 bg-slate-900 rounded-full shadow-sm mb-2"><Moon className="w-5 h-5 text-indigo-400" /></div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Dark Mode</span>
                  </button>

                  <button disabled className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 opacity-50 cursor-not-allowed">
                    <div className="p-3 bg-gray-100 rounded-full mb-2"><Monitor className="w-5 h-5 text-gray-500" /></div>
                    <span className="text-sm font-medium text-gray-500">System</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}