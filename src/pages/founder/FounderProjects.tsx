import React, { useState } from "react";
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
import Modal from "../../components/ui/Modal"; // Import Modal
import { projects as initialProjects } from "../../data/mockData";
import { ArrowRight, Plus, Save } from "lucide-react";
import { motion } from "framer-motion";

export function FounderProjects() {
  const navigate = useNavigate();

  // 1. State for managing the project list
  const [myProjects, setMyProjects] = useState(initialProjects);

  // 2. State for Modal visibility
  const [showAddModal, setShowAddModal] = useState(false);

  // 3. State for the new project form
  const [newProject, setNewProject] = useState({
    name: "",
    domain: "",
    description: "",
    foundedDate: "",
  });

  // 4. Handle adding the new project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();

    const projectToAdd = {
      id: `p-${Date.now()}`, // Generate a temporary ID
      name: newProject.name,
      domain: newProject.domain,
      description: newProject.description,
      currentAIRL: 1, // Default to Level 1
      foundedDate: newProject.foundedDate,
      teamSize: "1",
    };

    // Add to list, close modal, and reset form
    setMyProjects([...myProjects, projectToAdd]);
    setShowAddModal(false);
    setNewProject({ name: "", domain: "", description: "", foundedDate: "" });
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
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
        {/* Render the Dynamic List of Projects */}
        {myProjects.map((project) => (
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
                  AIR Level {project.currentAIRL}
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

        {/* Add Project Card Trigger */}
        <motion.div variants={item}>
          <div
            className="h-full min-h-[280px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer group"
            onClick={() => setShowAddModal(true)} // Open Modal on click
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

      {/* --- ADD PROJECT POPUP MODAL --- */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Project"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
