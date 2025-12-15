import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { Input, Textarea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Upload, Save, ArrowLeft, Image } from "lucide-react";
import { SupplierProfile } from "./types";

const PROFILE_KEY = "artpark_supplier_profile";

function readProfile(): SupplierProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}
function writeProfile(p: SupplierProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export default function ProfileEditPage(): JSX.Element {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SupplierProfile>({
    id: undefined,
    name: "",
    tagline: "",
    about: "",
    capabilities: [],
    email: "",
    phone: "",
    website: "",
    address: "",
    logoDataUrl: "",
    bannerDataUrl: "",
    published: false,
  });

  useEffect(() => {
    const p = readProfile();
    if (p) setProfile(p);
  }, []);

  const onFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "logoDataUrl" | "bannerDataUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setProfile((s) => ({ ...s, [key]: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    const toSave = {
      ...profile,
      id: profile.id ?? `supplier_${Date.now()}`,
      published: true, // Auto-publish on save for simplicity
    };
    writeProfile(toSave);
    navigate("/supplier/profile");
  };

  return (
    <DashboardLayout role="supplier" title="Edit Company Profile">
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/supplier/dashboard")}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button onClick={save} leftIcon={<Save className="w-4 h-4" />}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Upload your logo and cover image to stand out in the
                marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Banner
                </label>
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 group hover:border-blue-400 transition-colors">
                  {profile.bannerDataUrl ? (
                    <img
                      src={profile.bannerDataUrl}
                      alt="banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                      <Image className="w-8 h-8 opacity-50" />
                      <span className="text-sm">1200x400px recommended</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-100 shadow-lg">
                      <Upload className="w-4 h-4" /> Change Banner
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onFile(e, "bannerDataUrl")}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="flex items-center gap-6 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                <div className="relative group">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-md bg-white">
                    <img
                      src={profile.logoDataUrl}
                      alt="logo"
                      className="object-contain"
                    />
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer text-white transition-opacity">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFile(e, "logoDataUrl")}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Company Logo
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    This will be displayed on your listings and profile card.{" "}
                    <br />
                    Recommended size: 400x400px.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Company Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
                <Input
                  label="Tagline"
                  placeholder="Short catchy description"
                  value={profile.tagline}
                  onChange={(e) =>
                    setProfile({ ...profile, tagline: e.target.value })
                  }
                />
                <Textarea
                  label="About Us"
                  rows={5}
                  value={profile.about}
                  onChange={(e) =>
                    setProfile({ ...profile, about: e.target.value })
                  }
                  placeholder="Tell us about your company history, mission, and key offerings..."
                />
                <Input
                  label="Capabilities (Comma separated)"
                  placeholder="e.g. CNC, 3D Printing, PCB"
                  value={(profile.capabilities || []).join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      capabilities: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Business Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
                <Input
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
                <Input
                  label="Website URL"
                  value={profile.website}
                  onChange={(e) =>
                    setProfile({ ...profile, website: e.target.value })
                  }
                />
                <Textarea
                  label="Physical Address"
                  rows={3}
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
