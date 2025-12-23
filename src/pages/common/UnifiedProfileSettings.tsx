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
  Briefcase,
  Building2,
  MapPin,
  Linkedin,
  Phone,
} from "lucide-react";
import { compressImage } from "../../utils/imageUtils";
import { API_URL } from "../../config";

// Defined Type to fix TypeScript errors
type Role =
  | "founder"
  | "admin"
  | "reviewer"
  | "supplier"
  | "mentor"
  | "lab_owner";

export function UnifiedProfileSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get User Context
  const userStr = localStorage.getItem("artpark_user");
  const storedRole = localStorage.getItem("active_role");
  const activeRole = (storedRole || "founder") as Role;

  const user = userStr ? JSON.parse(userStr) : null;

  // --- UNIFIED SCHEMA STATE ---
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    title: "", // Designation / Job Title
    organization: "", // Company / Startup / Institution
    avatarUrl: "",
    website: "",
    bio: "",
    tags: "",
    location: "",
    linkedin: "",
  });

  // --- Theme Effect ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Load Profile ---
  useEffect(() => {
    if (!user?.id) return;

    // 1. Try User-Specific Cache
    const cacheKey = `artpark_profile_cache_${user.id}`;
    const cachedProfile = localStorage.getItem(cacheKey);

    if (cachedProfile) {
      setFormData((prev) => ({ ...prev, ...JSON.parse(cachedProfile) }));
    }

    // 2. Fetch API
    setLoading(true);
    fetch(`${API_URL}/api/user/profile?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          // Map backend fields
          const mappedData = {
            ...data,
            title: data.title || data.designation || "",
            organization: data.organization || data.startupName || "",
            bio: data.bio || data.description || "",
            tags: data.tags || data.industry || "",
          };

          setFormData((prev) => ({ ...prev, ...mappedData }));

          // Update Cache & Sync Header
          localStorage.setItem(cacheKey, JSON.stringify(mappedData));
          window.dispatchEvent(
            new CustomEvent("profile-updated", { detail: mappedData })
          );
        }
      })
      .catch((err) => console.error("Failed to load profile", err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // --- Handlers ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData((prev) => ({ ...prev, avatarUrl: compressedBase64 }));
      } catch (err) {
        console.error("Image compression failed", err);
      }
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setMsg(null);

    // 1. Optimistic Update
    const cacheKey = `artpark_profile_cache_${user.id}`;
    localStorage.setItem(cacheKey, JSON.stringify(formData));
    window.dispatchEvent(
      new CustomEvent("profile-updated", { detail: formData })
    );

    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...formData }),
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Tag Logic ---
  const tagsList = formData.tags
    ? formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const handleAddTag = () => {
    const newTag = prompt("Add a skill or tag:");
    if (newTag)
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags ? `${prev.tags}, ${newTag}` : newTag,
      }));
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tagsList.filter((t) => t !== tag).join(", ");
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  if (!user) return <div className="p-8 text-center">Please log in.</div>;

  return (
    <DashboardLayout role={activeRole} title="Settings">
      <div className="flex flex-col md:flex-row gap-6">
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 space-y-2">
          <Card>
            <CardContent className="p-2">
              {[
                { id: "general", label: "Profile", icon: User },
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

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-6">
          {msg && (
            <div
              className={`p-4 rounded-lg flex items-center gap-2 border ${
                msg.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{msg.text}</span>
            </div>
          )}

          {/* --- TAB: GENERAL (UNIFIED PROFILE) --- */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Identity Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <img
                      src={
                        formData.avatarUrl || "https://via.placeholder.com/150"
                      }
                      alt="Avatar"
                      className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover shadow-sm"
                    />
                    <div>
                      <div className="flex gap-2 mb-1">
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
                          Change Photo
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
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Chen"
                    />
                    <Input
                      label="Email (Locked)"
                      value={user.email}
                      disabled
                      className="bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <Input
                      label="Role (Locked)"
                      value={activeRole.toUpperCase().replace("_", " ")}
                      disabled
                      className="bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details (STATIC LABELS) */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Designation" // Static Label
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. CEO, Senior Reviewer, Manager..."
                    />
                    <Input
                      label="Organization" // Static Label
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. Startup Name, Company, University..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                    <Input
                      label="LinkedIn URL"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
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
                    label="Short Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                  />

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills & Tags
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      {tagsList.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="neutral"
                          className="bg-white border shadow-sm px-2 py-1 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
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

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}

          {/* --- TAB: APPEARANCE (Static) --- */}
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
                    <Sun className="w-6 h-6 mb-2 text-orange-500" />
                    <span className="font-medium">Light Mode</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "border-blue-600 bg-slate-800 text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Moon className="w-6 h-6 mb-2 text-indigo-400" />
                    <span className="font-medium">Dark Mode</span>
                  </button>
                  <button
                    disabled
                    className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 opacity-50 cursor-not-allowed"
                  >
                    <Monitor className="w-6 h-6 mb-2 text-gray-400" />
                    <span className="font-medium text-gray-500">
                      System (Soon)
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Email me about weekly progress",
                    "Notify me when a reviewer comments",
                    "Send daily digest of platform news",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-700">{text}</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Password</p>
                    <p className="text-xs text-gray-500">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                <div className="flex justify-between items-center p-4 border border-red-100 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-red-700">
                      Delete Account
                    </p>
                    <p className="text-xs text-red-500">
                      This action is irreversible
                    </p>
                  </div>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
