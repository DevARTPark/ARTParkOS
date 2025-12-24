import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input, Textarea } from "../../components/ui/Input";
import { ProgressBar } from "../../components/ui/ProgressBar";
import Modal from "../../components/ui/Modal";
import {
  Pencil,
  Save,
  Target,
  Calendar,
  Rocket,
  ArrowRight,
  ExternalLink,
  Wallet,
} from "lucide-react";
import { API_URL } from "../../config";

export function FounderProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    description: "",
  });

  // 1. Fetch Real Data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProjectData(data);
        // Initialize Edit Form
        setFormData({
          name: data.name || "",
          domain: data.domain || "",
          description: data.description || "",
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // 2. Handle Update
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedData = await res.json();
      setProjectData(updatedData.project);
      setShowEditModal(false);
    } catch (err) {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // Mock Finance Data (Static)
  const funding = {
    raised: "₹45.0 L",
    grant: "₹25.0 L",
    equity: "₹20.0 L",
    runway: "8 Months",
    burnRate: "₹3.5 L/mo",
  };

  if (loading)
    return (
      <DashboardLayout role="founder" title="Project Details">
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );
  if (!projectData)
    return (
      <DashboardLayout role="founder" title="Project Details">
        <div className="p-8">Project not found.</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout role="founder" title="Project Details">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {projectData.name}
            </h1>
            <Badge variant={projectData.currentAIRL >= 4 ? "success" : "info"}>
              AIRL {projectData.currentAIRL}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="neutral" className="text-sm px-3 py-1">
              {projectData.domain || "No Domain Tag"}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-gray-500 ml-4">
              <Calendar className="w-4 h-4" />
              Created: {new Date(projectData.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-3 self-start md:self-center">
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            leftIcon={<Pencil className="w-4 h-4" />}
          >
            Edit Details
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About the Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed text-base whitespace-pre-wrap">
                {projectData.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          {/* Finance (Mock) */}
          <Card className="border-t-4 border-t-green-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-600" /> Funding &
                Financials
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-700 hover:text-green-800 hover:bg-green-50"
              >
                Manage Finances <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-green-50 rounded-xl mb-6">
                <div>
                  <p className="text-[10px] text-green-600 uppercase font-bold">
                    Total Raised
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {funding.raised}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-green-600 uppercase font-bold">
                    Grants
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {funding.grant}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-red-500 uppercase font-bold">
                    Burn Rate
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {funding.burnRate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-green-600 uppercase font-bold">
                    Runway
                  </p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {funding.runway}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-blue-600 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" /> AIRL Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 mb-6">
                <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-blue-50 bg-white shadow-inner">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                      LEVEL
                    </p>
                    <p className="text-5xl font-extrabold text-blue-600">
                      {projectData.currentAIRL}
                    </p>
                  </div>
                </div>
                <p className="mt-4 font-medium text-gray-900">
                  {projectData.currentAIRL <= 3
                    ? "Proof of Concept"
                    : "Prototype"}
                </p>
              </div>
              <Button
                className="w-full h-12 text-base shadow-blue-200 shadow-lg"
                onClick={() =>
                  navigate(`/founder/assessment?projectId=${projectData.id}`)
                }
              >
                Update Assessment <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project Details"
        size="md"
      >
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Domain / Industry"
            value={formData.domain}
            onChange={(e) =>
              setFormData({ ...formData, domain: e.target.value })
            }
          />
          <Textarea
            label="Short Description"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
