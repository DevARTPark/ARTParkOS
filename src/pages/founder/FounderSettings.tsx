import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/TextArea"; // Ensure this path is correct based on your project
import { Badge } from "../../components/ui/Badge";
import {
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Mail,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Phone,
  Building,
  Lock,
  Save,
  Check
} from "lucide-react";
import { compressImage } from "../../utils/imageUtils"; 
import { API_URL } from "../../config";
import { currentUser } from "../../data/mockData"; // Fallback data

export function FounderSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- 1. INITIALIZE STATE FROM LOCAL STORAGE (Fixes "Fake Settings") ---
  const [formData, setFormData] = useState(() => {
    // Check if we have saved settings specifically for this form
    const savedProfile = localStorage.getItem('founder_profile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    
    // If not, fall back to the authenticated user info or mock data
    const userStr = localStorage.getItem("artpark_user");
    const user = userStr ? JSON.parse(userStr) : currentUser;

    return {
      founderName: user.name || "Alex Chen",
      email: user.email || "alex@greenfield.com",
      phone: "+91 98765 43210",
      designation: "Founder & CEO",
      avatarUrl: user.avatar || "",
      startupName: "GreenField Tech",
      website: "www.greenfield.tech",
      description: "Building the future of sustainable agriculture through IoT and AI-driven insights.",
      industry: "AgriTech, IoT, AI",
      location: "Bengaluru, India",
      // Password fields (usually empty on load)
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  });

  // --- Theme Effect ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- 2. LOAD FROM API (Optional Hybrid Approach) ---
  // If you have a backend, you can fetch fresh data here to override local storage
  // For now, we will stick to LocalStorage as the primary source of truth for the prototype.

  // --- Handlers ---

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData((prev: any) => ({ ...prev, avatarUrl: compressedBase64 }));
      } catch (err) {
        console.error("Image compression failed", err);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (msg) setMsg(null); // Clear message on edit
  };

  // --- 3. SAVE LOGIC (Fixes Persistence) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    // Simulate Network Delay
    setTimeout(() => {
      try {
        // A. Save to 'founder_profile' Key (This persists the form data)
        localStorage.setItem("founder_profile", JSON.stringify(formData));

        // B. Update the Global User Object (So Sidebar/Header updates instantly)
        const userStr = localStorage.getItem("artpark_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.name = formData.founderName;
          user.avatar = formData.avatarUrl; // Update avatar too
          localStorage.setItem("artpark_user", JSON.stringify(user));
        }

        // C. Dispatch Event to notify Header component (if listening)
        window.dispatchEvent(new Event("storage"));

        setMsg({ type: "success", text: "Profile settings saved successfully!" });
      } catch (err) {
        setMsg({ type: "error", text: "Failed to save settings." });
      } finally {
        setSaving(false);
        // Clear success message after 3 seconds
        setTimeout(() => setMsg(null), 3000);
      }
    }, 800);
  };

  // --- Tag Handlers ---
  const handleAddTag = () => {
    const newTag = prompt("Enter domain:");
    if (newTag)
      setFormData((prev: any) => ({
        ...prev,
        industry: prev.industry ? `${prev.industry}, ${newTag}` : newTag,
      }));
  };
  
  const handleRemoveTag = (tag: string) => {
    const tags = formData.industry
      .split(",")
      .map((t: string) => t.trim())
      .filter((t: string) => t !== tag);
    setFormData((prev: any) => ({ ...prev, industry: tags.join(", ") }));
  };
  
  const industryTags = formData.industry
    ? formData.industry.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  return (
    <DashboardLayout role="founder" title="Account Settings">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2">
          <Card>
            <CardContent className="p-2">
              {[
                { id: "general", label: "Profile & Company", icon: User },
                { id: "appearance", label: "Appearance", icon: Sun },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "security", label: "Security", icon: Shield },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      activeTab === item.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Feedback Message */}
          {msg && (
            <div
              className={`p-4 rounded-lg flex items-center gap-2 ${
                msg.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              } border animate-in fade-in slide-in-from-top-2`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{msg.text}</span>
            </div>
          )}

          {/* --- Tab: General --- */}
          {activeTab === "general" && (
            <form onSubmit={handleSave} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={formData.avatarUrl || "https://ui-avatars.com/api/?name=" + formData.founderName}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover shadow-sm"
                    />
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Avatar
                        </Button>
                        {formData.avatarUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => setFormData((p: any) => ({ ...p, avatarUrl: "" }))}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Chen"
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input
                        value={formData.email}
                        disabled
                        className="bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91..."
                    />
                    <Input
                      label="Job Title"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. CEO"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Startup Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Startup Name"
                      name="startupName"
                      value={formData.startupName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                  <Textarea
                    label="Short Bio / Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Briefly describe your innovation..."
                  />
                  
                  {/* Industry Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Domain(s)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {industryTags.map((tag: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="info"
                          className="cursor-pointer hover:bg-blue-200 transition-colors"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs border border-dashed border-gray-300 text-gray-500"
                      >
                        + Add Tag
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className={`min-w-[140px] transition-all ${msg?.type === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  leftIcon={msg?.type === 'success' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                >
                  {saving ? "Saving..." : msg?.type === 'success' ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </form>
          )}

          {/* --- Tab: Appearance --- */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Theme Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      theme === "light"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full bg-white border border-gray-200 rounded-lg p-2 mb-3 shadow-sm h-16"></div>
                    <div className="flex items-center font-medium text-gray-900">
                      <Sun className="w-4 h-4 mr-2" /> Light
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "border-blue-600 bg-slate-800"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mb-3 shadow-sm h-16"></div>
                    <div className={`flex items-center font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      <Moon className="w-4 h-4 mr-2" /> Dark
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- Tab: Notifications --- */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Weekly AIRL Progress Summary",
                    "New Reviewer Comments posted",
                    "Mentor Session reminders",
                    "Platform announcements & news",
                  ].map((item, i) => (
                    <label key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer">
                      <span className="text-sm text-gray-700">{item}</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- Tab: Security --- */}
          {activeTab === "security" && (
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
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}