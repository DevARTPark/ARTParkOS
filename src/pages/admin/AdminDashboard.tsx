import React from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { TRLDistributionChart } from "../../components/charts/TRLDistributionChart";
import { startups } from "../../data/mockData";
import { Filter, Download, MoreHorizontal } from "lucide-react";
export function AdminDashboard() {
  return (
    <DashboardLayout role="admin" title="Admin Overview">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>TRL Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TRLDistributionChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <div className="w-32 h-32 rounded-full border-8 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
              <p>Robotics (45%)</p>
              <p>Healthcare (30%)</p>
              <p>AgriTech (25%)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameter Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <div className="grid grid-cols-5 gap-1 w-full">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-sm ${
                    Math.random() > 0.5
                      ? "bg-blue-500 opacity-80"
                      : "bg-blue-200"
                  }`}
                  title="Parameter Score"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portfolio Snapshot</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Startup</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Domain</th>
                  <th className="px-6 py-3">Current TRL</th>
                  <th className="px-6 py-3">Weakest Param</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {startups.map((startup) => (
                  <tr
                    key={startup.id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center space-x-3">
                      <img
                        src={startup.logo}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{startup.name}</span>
                    </td>
                    <td className="px-6 py-4">{startup.projects[0].name}</td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral">
                        {startup.projects[0].domain}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">
                      TRL {startup.projects[0].currentTRL}
                    </td>
                    <td className="px-6 py-4 text-red-500">Market Research</td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
