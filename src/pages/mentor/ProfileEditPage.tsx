import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/TextArea";
import { Save, ArrowLeft } from "lucide-react";
import { currentMentor } from "../../data/mockMentorData";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(currentMentor);
  const [isSaving, setIsSaving] = useState(false);

  const save = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate("/mentor/profile");
    }, 800);
  };

  return (
    <DashboardLayout role="mentor" title="Edit Profile">
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/mentor/profile")}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              label="Title / Role"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Input
              label="Affiliation (Company / University)"
              value={formData.affiliation}
              onChange={(e) =>
                setFormData({ ...formData, affiliation: e.target.value })
              }
            />
            <Textarea
              label="Bio"
              rows={5}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <Input
              label="Expertise (Comma separated)"
              value={formData.expertise.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expertise: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
