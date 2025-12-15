import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Store, // Suppliers
  Cpu, // Software
  Building2, // In-House Facilities
  Microscope, // Test Labs
  Brain, // Knowledge AI
  Users, // Mentors
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/Card";

export default function FacilitiesHub() {
  const navigate = useNavigate();

  const resources = [
    {
      title: "Find Suppliers",
      description:
        "Connect with verified suppliers for parts, manufacturing, and raw materials.",
      icon: Store,
      path: "/founder/suppliers",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "In-House Facilities",
      description:
        "Book ARTPark's internal equipment, 3D printers, and workshops.",
      icon: Building2,
      path: "/founder/facilities/in-house",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Test Labs",
      description:
        "Reserve slots at specialized testing labs for validation and certification.",
      icon: Microscope,
      path: "/founder/labs",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Software Licenses",
      description:
        "Access shared licenses for CAD, simulation, and AI development tools.",
      icon: Cpu,
      path: "/founder/software",
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Mentors & Experts",
      description:
        "Schedule sessions with industry veterans and technical advisors.",
      icon: Users,
      path: "/founder/mentors",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Knowledge AI",
      description:
        "Ask our AI assistant to help you find resources and answer queries.",
      icon: Brain,
      path: "/founder/knowledge-ai",
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <DashboardLayout role="founder" title="Facilities & Resources">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Resource Ecosystem
          </h1>
          <p className="text-gray-600 mt-1">
            Access all the tools, facilities, and expertise you need to build
            your startup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item) => (
            <Card
              key={item.title}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-200"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
