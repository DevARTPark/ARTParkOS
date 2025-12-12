import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/TextArea";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Avatar } from "../../components/ui/Avatar";
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
      published: true,
    };
    writeProfile(toSave);
    navigate("/supplier/dashboard");
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Company name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <Label className="text-sm">Tagline</Label>
                  <Input
                    value={profile.tagline}
                    onChange={(e) =>
                      setProfile({ ...profile, tagline: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label className="text-sm">About</Label>
                  <Textarea
                    value={profile.about}
                    onChange={(e) =>
                      setProfile({ ...profile, about: e.target.value })
                    }
                    rows={6}
                  />
                </div>

                <div>
                  <Label className="text-sm">
                    Capabilities (comma separated)
                  </Label>
                  <Input
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
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Phone</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Website</Label>
                    <Input
                      value={profile.website}
                      onChange={(e) =>
                        setProfile({ ...profile, website: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Address</Label>
                    <Input
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <Label className="text-sm">Logo</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFile(e, "logoDataUrl")}
                    />
                    {profile.logoDataUrl && (
                      <Avatar className="mt-3">
                        <img src={profile.logoDataUrl} alt="logo" />
                      </Avatar>
                    )}
                  </div>

                  <div className="flex-1">
                    <Label className="text-sm">Banner</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFile(e, "bannerDataUrl")}
                    />
                    {profile.bannerDataUrl && (
                      <img
                        src={profile.bannerDataUrl}
                        alt="banner"
                        className="mt-3 w-full h-28 object-cover rounded"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/supplier/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={save}>Save & Publish</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
