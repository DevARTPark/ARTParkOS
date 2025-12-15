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
  Users,
  Clock,
  Calendar,
  Video,
  Star,
  ArrowRight,
  FileText,
} from "lucide-react";
import { currentMentor, mentorSessions } from "../../data/mockMentorData";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const upcoming = mentorSessions
    .filter((s) => s.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextSession = upcoming[0];

  return (
    <DashboardLayout role="mentor" title="Dashboard">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {currentMentor.name}
            </h1>
            <p className="text-gray-600 mt-1">{currentMentor.title}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/mentor/schedule")}
            >
              Manage Availability
            </Button>
            <Button onClick={() => navigate("/mentor/sessions")}>
              View All Sessions
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Startups Mentored
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">12</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Volunteer Hours
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {currentMentor.totalHours}
                </h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Founder Rating
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {currentMentor.rating}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <Star className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Up Next Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" /> Up Next
                </CardTitle>
                {nextSession && <Badge variant="success">Upcoming</Badge>}
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center">
              {nextSession ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {nextSession.topic}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      with{" "}
                      <span className="font-semibold text-gray-900">
                        {nextSession.founderName}
                      </span>{" "}
                      ({nextSession.startupName})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(nextSession.date).toLocaleDateString()}
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {nextSession.time} ({nextSession.duration}m)
                    </div>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={() =>
                        window.open(nextSession.meetingLink, "_blank")
                      }
                    >
                      <Video className="w-4 h-4 mr-2" /> Join Call
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate(`/mentor/sessions/${nextSession.id}`)
                      }
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No upcoming sessions. Enjoy your free time!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-orange-100 bg-orange-50 flex gap-4 items-start">
                  <div className="bg-white p-2 rounded-full shadow-sm text-orange-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Upload Session Notes
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Startup: <strong>DroneLogistics</strong> (Completed 2 days
                      ago)
                    </p>
                    <button
                      onClick={() => navigate("/mentor/sessions")}
                      className="text-xs font-semibold text-orange-700 mt-2 hover:underline flex items-center"
                    >
                      Complete Now <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
