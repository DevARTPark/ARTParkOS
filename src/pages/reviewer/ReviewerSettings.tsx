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
  Mail,
  Sliders,
  Save,
  Check,
  Loader2
} from 'lucide-react';

export function ReviewerSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // --- 1. INITIALIZE STATE FROM STORAGE (Fixes "Fake Settings") ---
  const [profile, setProfile] = useState(() => {
    // Check if we have saved settings specifically for this form
    const savedProfile = localStorage.getItem('reviewer_profile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    
    // Default fallback (Mock Data)
    return {
      name: "Amit Patel",
      email: "amit@artpark.in",
      jobTitle: "Senior Program Manager",
      department: "Innovation & Grants",
      bio: "Focusing on Robotics and Autonomous Systems startups. Handling AIRL 4-7 progression.",
      
      // Preferences
      workingDays: ['M', 'T', 'W', 'T', 'F'],
      timezone: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
      reviewDuration: "60 Minutes",
      bufferTime: "15 Minutes",
      autoSave: true,

      // Notifications
      emailAlerts: {
        newAssessment: true,
        monthlyReport: true,
        commentReply: true,
        dailyDigest: false,
        redFlags: true
      }
    };
  });

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

  // --- Handlers ---
  const handleChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleNestedChange = (parent: string, key: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
    setIsSaved(false);
  };

  const toggleDay = (day: string) => {
    const currentDays = profile.workingDays;
    if (currentDays.includes(day)) {
      handleChange('workingDays', currentDays.filter(d => d !== day));
    } else {
      handleChange('workingDays', [...currentDays, day]);
    }
  };

  // --- 2. SAVE LOGIC (Fixes Persistence) ---
  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // A. Save to 'reviewer_profile' Key
      localStorage.setItem('reviewer_profile', JSON.stringify(profile));

      // B. Update Global User Object (Sync Header Name)
      const userStr = localStorage.getItem('artpark_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = profile.name; 
        localStorage.setItem('artpark_user', JSON.stringify(user));
        window.dispatchEvent(new Event("storage")); // Trigger updates elsewhere
      }

      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 800);
  };

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
                      src={`https://ui-avatars.com/api/?name=${profile.name.replace(' ', '+')}&background=0F172A&color=fff`} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full border-2 border-gray-100" 
                    />
                    <div>
                      <Button variant="outline" size="sm" className="mb-1">Upload New Photo</Button>
                      <p className="text-xs text-gray-500">Recommended size: 400x400px</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Full Name" 
                      value={profile.name} 
                      onChange={(e) => handleChange('name', e.target.value)} 
                    />
                    <Input 
                      label="Email Address" 
                      value={profile.email} 
                      disabled 
                      className="bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <Input 
                      label="Job Title" 
                      value={profile.jobTitle} 
                      onChange={(e) => handleChange('jobTitle', e.target.value)} 
                    />
                    <Input 
                      label="Department" 
                      value={profile.department} 
                      onChange={(e) => handleChange('department', e.target.value)} 
                    />
                  </div>
                  <Textarea 
                    label="Bio (Internal)" 
                    value={profile.bio} 
                    onChange={(e) => handleChange('bio', e.target.value)} 
                    rows={2} 
                  />
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className={isSaved ? "bg-green-600 hover:bg-green-700" : ""}
                  leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : isSaved ? <Check className="w-4 h-4"/> : <Save className="w-4 h-4"/>}
                >
                  {isLoading ? "Saving..." : isSaved ? "Changes Saved" : "Save Profile"}
                </Button>
              </div>
            </div>
          )}

          {/* --- 2. Review Preferences --- */}
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
                          <button 
                            key={i} 
                            onClick={() => toggleDay(d)}
                            className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center border transition-colors ${
                              profile.workingDays.includes(d) 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-gray-400 border-gray-200 hover:border-blue-400'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select 
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={profile.timezone}
                        onChange={(e) => handleChange('timezone', e.target.value)}
                      >
                        <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                        <option>(GMT+00:00) London</option>
                        <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Review Duration</label>
                      <select 
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                        value={profile.reviewDuration}
                        onChange={(e) => handleChange('reviewDuration', e.target.value)}
                      >
                        <option>30 Minutes</option>
                        <option>60 Minutes</option>
                        <option>90 Minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Between Meetings</label>
                      <select 
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                        value={profile.bufferTime}
                        onChange={(e) => handleChange('bufferTime', e.target.value)}
                      >
                        <option>None</option>
                        <option>15 Minutes</option>
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
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={profile.autoSave}
                      onChange={(e) => handleChange('autoSave', e.target.checked)}
                      className="text-blue-600 rounded focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-700">Auto-save grading drafts every 2 minutes</span>
                  </label>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className={isSaved ? "bg-green-600" : ""}
                >
                  {isLoading ? "Updating..." : isSaved ? "Preferences Updated" : "Update Preferences"}
                </Button>
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
                      { key: 'newAssessment', label: 'New Assessment Submitted for Review' },
                      { key: 'monthlyReport', label: 'Startup uploads Monthly Report' },
                      { key: 'commentReply', label: 'Comment reply from Founder' },
                      { key: 'dailyDigest', label: 'Daily Digest: Upcoming Reviews' },
                      { key: 'redFlags', label: 'Red Flag Alerts (Critical)' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors cursor-pointer">
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <input 
                          type="checkbox" 
                          checked={profile.emailAlerts[item.key]}
                          onChange={(e) => handleNestedChange('emailAlerts', item.key, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} size="sm">Save Notification Settings</Button>
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
                  <Button variant="outline" size="sm" onClick={() => alert("Password change flow would open here.")}>Update</Button>
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
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
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