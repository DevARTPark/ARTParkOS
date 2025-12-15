import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Activity,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { currentLabOwner, bookingRequests } from "../../data/mockLabOwnerData";

export default function LabOwnerDashboard() {
  const navigate = useNavigate();
  const pendingRequests = bookingRequests.filter((b) => b.status === "pending");
  const activeBookings = bookingRequests.filter((b) => b.status === "approved");

  return (
    <DashboardLayout role="lab_owner" title="Lab Dashboard">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {currentLabOwner.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Managing: {currentLabOwner.labName}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/lab-owner/services")}
            >
              Manage Assets
            </Button>
            <Button onClick={() => navigate("/lab-owner/bookings")}>
              View Bookings ({pendingRequests.length})
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Bookings
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {bookingRequests.length}
                </h3>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 12% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Activity className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Requests
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {pendingRequests.length}
                </h3>
                <p className="text-xs text-orange-600 mt-1">Requires action</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                <AlertCircle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Utilization Rate
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">78%</h3>
                <p className="text-xs text-gray-500 mt-1">420/540 Hours</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-green-600">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Incoming Requests */}
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Incoming Requests</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/lab-owner/bookings")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {req.startupName}
                        </h4>
                        <Badge variant="neutral">Pending</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Requesting <strong>{req.equipmentName}</strong> for{" "}
                        {req.duration} hours.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="w-full">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No pending requests.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBookings.length > 0 ? (
                  activeBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100"
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {booking.equipmentName}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {new Date(booking.date).toLocaleDateString()} •{" "}
                          {booking.startupName}
                        </p>
                      </div>
                      <Badge variant="success">Confirmed</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No active bookings for today.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
