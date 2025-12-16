import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone, 
  Mail, 
  LogOut, 
  Monitor
} from 'lucide-react';

export function FounderSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [theme,XH] = useState(localStorage.getItem('theme') || 'light');

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
    <DashboardLayout role="founder" title="Account Settings">
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2">
          <Card>
            <CardContent className="p-2">
              {[
                { id: 'general', label: 'Profile & Company', icon: User },
                { id: 'appearance', label: 'Appearance', icon: Sun },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Shield },
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

        {/* Right Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* --- Tab: Profile & Company --- */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full border-2 border-gray-100" 
                    />
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Change Avatar</Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">Remove</Button>
                      </div>
                      <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size 800K</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue="Alex Chen" />
                    <Input label="Email Address" defaultValue="alex@greenfield.com" disabled />
                    <Input label="Phone Number" defaultValue="+91 98765 43210" />
                    <Input label="Job Title" defaultValue="Founder & CEO" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Startup Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Startup Name" defaultValue="GreenField Tech" />
                    <Input label="Website" defaultValue="https://greenfield.com" />
                  </div>
                  <Textarea 
                    label="Short Bio / Pitch" 
                    defaultValue="Developing IoT sensors for precision agriculture monitoring soil health to improve crop yields by 30%."
                    rows={3}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Domain</label>
                    <div className="flex gap-2">
                      <Badge variant="info">AgriTech</Badge>
                      <Badge variant="neutral">IoT</Badge>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">+ Add</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          )}

          {/* --- Tab: Appearance (Dark Mode) --- */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Theme Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => XH('light')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full bg-white border border-gray-200 rounded-lg p-2 mb-3 shadow-sm">
                      <div className="space-y-2">
                        <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="flex items-center font-medium text-gray-900">
                      <Sun className="w-4 h-4 mr-2" /> Light
                    </div>
                  </button>

                  <button 
                    onClick={() => XH('dark')}
                    className={`flex flex-col items-center p-4 rounded-xlpK border-2 transition-all ${
                      theme === 'dark' ? 'border-blue-600 bg-slate-800' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mb-3 shadow-sm">
                      <div className="space-y-2">
                        <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                        <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className={`flex items-center font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <Moon className="w-4 h-4 mr-2" /> Dark
                    </div>
                  </button>

                  <button disabled className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 opacity-50 cursor-not-allowed">
                    <div className="w-full bg-gray-100 rounded-lg p-2 mb-3">
                      <div className="space-y-2">
                        <div className="h-2 w-3/4 bg-gray-300 rounded"></div>
                        <div className="h-2 w-1/2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    <div className="flex items-center font-medium text-gray-500">
                      <Monitor className="w-4 h-4 mr-2" /> System
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- Tab: Notifications --- */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Weekly AIRL Progress Summary',
                      'New Reviewer Comments posted',
                      'Mentor Session reminders',
                      'Platform announcements & news'
                    ].map((item, i) => (
                      <label key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-700">{item}</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- Tab: Security --- */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Password</p>
                      <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delete Account</p>
                      <p className="text-xs text-gray-500">Permanently remove your account and all data</p>
                    </div>
                    <Button variant="danger" size="sm">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}