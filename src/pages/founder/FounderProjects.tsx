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
import { projects as initialProjects } from "../../data/mockData";
import { ArrowRight, Plus, Save, Activity } from "lucide-react";
import { motion } from "framer-motion";

// Helper for date calc
const getDeadlineDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7); // +7 Days
  return date.toISOString().split('T')[0];
};

export function FounderProjects() {
  const navigate = useNavigate();
  
  // 1. LOAD PROJECTS FROM STORAGE (Persistence Fix)
  // This ensures we see projects added in previous sessions
  const [myProjects, setMyProjects] = useState(() => {
    const savedProjects = localStorage.getItem('founder_projects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    domain: "",
    description: "",
    foundedDate: "",
    estimatedAIRL: "1",
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();

    const estLevel = parseInt(newProject.estimatedAIRL);

    const projectToAdd = {
      id: `p-${Date.now()}`,
      name: newProject.name,
      domain: newProject.domain,
      description: newProject.description,
      currentAIRL: 0, // Officially 0 until validated
      estimatedAIRL: estLevel,
      isNew: true, 
      baselineDeadline: getDeadlineDate(),
      foundedDate: newProject.foundedDate,
      teamSize: "1",
    };

    const updatedProjects = [...myProjects, projectToAdd];
    setMyProjects(updatedProjects);
    
    // 2. SAVE TO LOCAL STORAGE
    // This makes the project available to the Assessment Page
    localStorage.setItem('founder_projects', JSON.stringify(updatedProjects));

    setShowAddModal(false);
    setNewProject({ name: "", domain: "", description: "", foundedDate: "", estimatedAIRL: "1" });
    
    // Navigate to assessment with the new project ID
    navigate(`/founder/assessment?projectId=${projectToAdd.id}`);
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
                  {project.isNew ? "Unverified" : `AIR Level ${project.currentAIRL}`}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col mt-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {project.domain}
                  </p>
                  {project.isNew && (
                    <div className="mt-2 bg-yellow-50 text-yellow-700 text-xs p-2 rounded border border-yellow-100">
                      <strong>Baseline Pending:</strong> Validate Level {project.estimatedAIRL} by {project.baselineDeadline}
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

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Innovation"
        size="md"
      >
        <form onSubmit={handleAddProject} className="space-y-4">
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
              required
            />
            <Input
              label="Founded Date"
              type="date"
              value={newProject.foundedDate}
              onChange={(e) =>
                setNewProject({ ...newProject, foundedDate: e.target.value })
              }
              required
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

          {/* Estimated AIRL Selection */}
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
              onChange={(e) => setNewProject({...newProject, estimatedAIRL: e.target.value})}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1 px-1">
              <span>Concept (1)</span>
              <span>Prototype (4)</span>
              <span>Scale (9)</span>
            </div>
            <p className="text-xs text-blue-700 mt-3 leading-relaxed">
              Based on your selection (Level {newProject.estimatedAIRL}), you will be required to submit a 
              <strong> Baseline Assessment</strong> covering all criteria from Level 1 to {newProject.estimatedAIRL}.
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
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Start Baseline Assessment
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}