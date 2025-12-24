import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { ArrowRight, Plus, Save, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "../../config";

export function FounderProjects() {
  const navigate = useNavigate();

  // User Context
  const userStr = localStorage.getItem("artpark_user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form State
  const [newProject, setNewProject] = useState({
    name: "",
    domain: "",
    description: "",
    foundedDate: "",
    estimatedAIRL: "1",
  });

  // --- 1. FETCH PROJECTS ---
  const fetchProjects = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setMyProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMyProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user?.id]);

  // --- 2. CREATE PROJECT ---
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setCreating(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: newProject.name,
          description: newProject.description,
          domain: newProject.domain, // <--- Sending Domain/Industry to Backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error(
            "Please complete your Startup Profile in Settings before creating a project."
          );
        }
        throw new Error(data.error || "Failed to create project");
      }

      // Success
      await fetchProjects();
      setShowAddModal(false);
      setNewProject({
        name: "",
        domain: "",
        description: "",
        foundedDate: "",
        estimatedAIRL: "1",
      });

      navigate(`/founder/assessment?projectId=${data.project.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout role="founder" title="My Projects">
      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Loading your innovations...
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {myProjects.map((project: any) => (
            <motion.div key={project.id} variants={item}>
              <Card
                className="h-full flex flex-col hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-blue-600"
                onClick={() => navigate(`/founder/project/${project.id}`)}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1">
                    {project.name}
                  </CardTitle>
                  <Badge
                    variant={project.currentAIRL >= 7 ? "success" : "info"}
                    className="whitespace-nowrap ml-2"
                  >
                    AIRL {project.currentAIRL}
                  </Badge>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col mt-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      {project.description || "No description provided."}
                    </p>
                    <p className="text-xs text-gray-400 font-medium bg-gray-50 inline-block px-2 py-1 rounded">
                      {project.domain || "General"}
                    </p>

                    {project.currentAIRL === 1 && (
                      <div className="mt-2 bg-yellow-50 text-yellow-700 text-xs p-2 rounded border border-yellow-100">
                        <strong>Baseline Pending:</strong> Validate Level 1
                        status.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                      Go To "{project.name}"{" "}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div variants={item}>
            <div
              className="h-full min-h-[280px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer group"
              onClick={() => setShowAddModal(true)}
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold">Add New Project</h3>
              <p className="text-sm text-center mt-2 max-w-[200px] opacity-80">
                Register a new innovation to begin tracking its AIR Level
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ADD PROJECT MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Innovation"
        size="md"
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> {error}
            </div>
          )}

          <Input
            label="Project Name"
            placeholder="e.g. SolarX Drone"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Domain / Industry"
              placeholder="e.g. AgriTech"
              value={newProject.domain}
              onChange={(e) =>
                setNewProject({ ...newProject, domain: e.target.value })
              }
            />
            <Input
              label="Founded Date"
              type="date"
              value={newProject.foundedDate}
              onChange={(e) =>
                setNewProject({ ...newProject, foundedDate: e.target.value })
              }
            />
          </div>

          <Textarea
            label="Short Description"
            placeholder="Describe your innovation in 2-3 sentences..."
            rows={3}
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            required
          />

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-blue-900 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Estimated Current Stage
              </label>
              <Badge variant="neutral">Level {newProject.estimatedAIRL}</Badge>
            </div>
            <input
              type="range"
              min="1"
              max="9"
              value={newProject.estimatedAIRL}
              onChange={(e) =>
                setNewProject({ ...newProject, estimatedAIRL: e.target.value })
              }
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1 px-1">
              <span>Concept (1)</span>
              <span>Prototype (4)</span>
              <span>Scale (9)</span>
            </div>
            <p className="text-xs text-blue-700 mt-3 leading-relaxed">
              Based on your selection, you will be asked to baseline your
              technology level.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {creating ? "Creating..." : "Start Baseline Assessment"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
