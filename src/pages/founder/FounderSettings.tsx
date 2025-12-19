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
import { Textarea } from "../../components/ui/TextArea";
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
} from "lucide-react";
import { compressImage } from "../../utils/imageUtils"; // <--- Import the utility
import { API_URL } from "../../config";

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
  const userStr = localStorage.getItem("artpark_user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [formData, setFormData] = useState({
    founderName: "",
    phone: "",
    designation: "",
    avatarUrl: "",
    startupName: "",
    website: "",
    description: "",
    industry: "",
    location: "",
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Load Profile (Network + Cache Strategy) ---
  useEffect(() => {
    if (!user?.id) return;

    // 1. Try loading from LocalStorage Cache first (Instant)
    const cachedProfile = localStorage.getItem("artpark_profile_cache");
    if (cachedProfile) {
      setFormData((prev) => ({ ...prev, ...JSON.parse(cachedProfile) }));
    }

    // 2. Fetch fresh data from API
    setLoading(true);
    fetch(`${API_URL}/api/founder/profile?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setFormData((prev) => ({ ...prev, ...data }));
          // Update cache
          localStorage.setItem("artpark_profile_cache", JSON.stringify(data));
        }
      })
      .catch((err) => console.error("Failed to load profile", err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // --- Optimized File Handler ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image before setting state (Reduces 2MB -> ~30KB)
        const compressedBase64 = await compressImage(file);
        setFormData((prev) => ({ ...prev, avatarUrl: compressedBase64 }));
      } catch (err) {
        console.error("Image compression failed", err);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);

    // --- INSTANT UI UPDATE ---
    // 1. Update LocalStorage Cache immediately
    localStorage.setItem("artpark_profile_cache", JSON.stringify(formData));

    // 2. Notify Header immediately
    const event = new CustomEvent("profile-updated", {
      detail: {
        founderName: formData.founderName,
        designation: formData.designation,
        avatarUrl: formData.avatarUrl,
      },
    });
    window.dispatchEvent(event);

    try {
      // 3. Send to Backend
      const res = await fetch(`${API_URL}/api/founder/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, data: formData }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMsg({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: "error", text: "Error saving profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const newTag = prompt("Enter domain:");
    if (newTag)
      setFormData((prev) => ({
        ...prev,
        industry: prev.industry ? `${prev.industry}, ${newTag}` : newTag,
      }));
  };
  const handleRemoveTag = (tag: string) => {
    const tags = formData.industry
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== tag);
    setFormData((prev) => ({ ...prev, industry: tags.join(", ") }));
  };
  const industryTags = formData.industry
    ? formData.industry
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  if (!user) return <div>Please log in.</div>;

  return (
    <DashboardLayout role="founder" title="Account Settings">
      <div className="flex flex-col md:flex-row gap-6">
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

        <div className="flex-1 space-y-6">
          {msg && (
            <div
              className={`p-4 rounded-lg flex items-center gap-2 ${
                msg.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              } border`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{msg.text}</span>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={
                        formData.avatarUrl || "https://via.placeholder.com/150"
                      }
                      alt="Avatar"
                      className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover"
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
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Avatar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() =>
                            setFormData((p) => ({ ...p, avatarUrl: "" }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG. Automatically resized.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleChange}
                      placeholder="Alex Chen"
                    />
                    <Input
                      label="Email Address"
                      value={user.email}
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
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
                      placeholder="CEO"
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
                    />
                  </div>
                  <Textarea
                    label="Short Bio"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Domain
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {industryTags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="info"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                      <Button
                        onClick={handleAddTag}
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs border border-dashed border-gray-300"
                      >
                        + Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}

          {/* --- Tab: Appearance (Dark Mode) --- */}
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
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "border-blue-600 bg-slate-800"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mb-3 shadow-sm">
                      <div className="space-y-2">
                        <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                        <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <Moon className="w-4 h-4 mr-2" /> Dark
                    </div>
                  </button>

                  <button
                    disabled
                    className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 opacity-50 cursor-not-allowed"
                  >
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
          {activeTab === "notifications" && (
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
                      "Weekly AIRL Progress Summary",
                      "New Reviewer Comments posted",
                      "Mentor Session reminders",
                      "Platform announcements & news",
                    ].map((item, i) => (
                      <label
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-sm text-gray-700">{item}</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- Tab: Security --- */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Password
                      </p>
                      <p className="text-xs text-gray-500">
                        Last changed 3 months ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-gray-500">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
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
                      <p className="text-sm font-medium text-gray-900">
                        Delete Account
                      </p>
                      <p className="text-xs text-gray-500">
                        Permanently remove your account and all data
                      </p>
                    </div>
                    <Button variant="danger" size="sm">
                      Delete Account
                    </Button>
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
