import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { projects } from '../../data/mockData'; // Assuming mockData exists
import { ArrowRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function FounderProjects() {
  const navigate = useNavigate();

  // Animation variants for smooth entrance
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout role="founder" title="My Projects">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Active Project Cards */}
        {projects.map((project) => (
          <motion.div key={project.id} variants={item}>
            <Card 
              className="h-full flex flex-col hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-blue-600"
              onClick={() => navigate(`/founder/assessment/${project.id}`)}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1">
                  {project.name}
                </CardTitle>
                <Badge variant={project.currentAIRL >= 7 ? 'success' : 'info'} className="whitespace-nowrap ml-2">
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
                    Go To "{project.name}" <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add Project Card */}
        <motion.div variants={item}>
          <div 
            className="h-full min-h-[280px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer group"
            onClick={() => console.log("Add New Project clicked")}
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
    </DashboardLayout>
  );
}