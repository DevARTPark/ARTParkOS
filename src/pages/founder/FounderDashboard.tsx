import React, { useState, Children } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { AIRLRadarChart } from '../../components/charts/AIRLRadarChart';
import { actionItems, facilities, mentors, reviews, projects } from '../../data/mockData';
import { ArrowRight, Calendar, Clock, ExternalLink, FileText, MapPin, Plus, Users } from 'lucide-react';
import { motion } from 'framer-motion';
export function FounderDashboard() {
  const [activeTab, setActiveTab] = useState('open');
  const currentProject = projects[0];
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0
    }
  };
  return <DashboardLayout role="founder" title="Startup Dashboard">
      {/* Project Selector Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentProject.name}
          </h2>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {currentProject.domain}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Founded{' '}
              {currentProject.foundedDate}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="text-right mr-4">
            <p className="text-sm text-gray-500">Current Level</p>
            <p className="text-3xl font-bold text-blue-600">
              AIRL {currentProject.currentAIRL}
            </p>
          </div>
          <Button onClick={() => window.location.href = '/founder/assessment'}>
            Continue Assessment <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AIRL Status Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AIRL Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2">
                  <AIRLRadarChart />
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0 pl-0 md:pl-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Recent Milestones
                  </h4>
                  <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">
                        AIRL 3 Achieved
                      </p>
                      <p className="text-xs text-gray-500">Oct 12, 2023</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">
                        AIRL 2 Verified
                      </p>
                      <p className="text-xs text-gray-500">Sep 01, 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Items Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Action Items</CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs tabs={[{
              id: 'open',
              label: 'Open'
            }, {
              id: 'in_progress',
              label: 'In Progress'
            }, {
              id: 'done',
              label: 'Done'
            }]} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />
              <div className="space-y-3">
                {actionItems.filter(i => i.status === activeTab).map(action => <div key={action.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {action.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {action.dueDate}
                        </p>
                      </div>
                      <Badge variant={action.priority === 'high' ? 'danger' : action.priority === 'medium' ? 'warning' : 'neutral'}>
                        {action.priority}
                      </Badge>
                    </div>)}
                {actionItems.filter(i => i.status === activeTab).length === 0 && <div className="text-center py-8 text-gray-400 text-sm">
                    No items found
                  </div>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Facilities Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Facilities & Labs</CardTitle>
              <Button variant="outline" size="sm">
                Book New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilities.slice(0, 2).map(facility => <div key={facility.id} className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg">
                    <img src={facility.image} alt={facility.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {facility.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        <Badge variant={facility.availability === 'available' ? 'success' : 'neutral'}>
                          {facility.availability}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2 capitalize">
                          {facility.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mentors Widget */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mentors & Experts</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentors.map(mentor => <div key={mentor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={mentor.image} alt={mentor.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {mentor.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {mentor.role} • {mentor.domain}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Request
                    </Button>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews Widget */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reviews & Documents</CardTitle>
              <Button>Submit Monthly Review</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Project</th>
                      <th className="px-4 py-3">AIRL Level</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Deadline</th>
                      <th className="px-4 py-3 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => <tr key={review.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {review.projectName}
                        </td>
                        <td className="px-4 py-3">AIRL {review.airlLevel}</td>
                        <td className="px-4 py-3">
                          <Badge variant={review.status === 'completed' ? 'success' : 'warning'}>
                            {review.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {review.deadline}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>;
}