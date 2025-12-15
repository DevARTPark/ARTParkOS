import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";
import { mentorSessions, MentorSession } from "../../data/mockMentorData";

export default function SessionListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const filtered = mentorSessions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  return (
    <DashboardLayout role="mentor" title="My Sessions">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Mentoring Sessions
          </h1>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(["all", "upcoming", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
              onClick={() => navigate(`/mentor/sessions/${session.id}`)}
            >
              <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {session.topic}
                    </h3>
                    <Badge
                      variant={
                        session.status === "upcoming" ? "success" : "neutral"
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <User className="w-4 h-4" />
                    <span>
                      {session.founderName} from{" "}
                      <strong>{session.startupName}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 text-sm text-gray-500 md:text-right md:border-l md:border-gray-100 md:pl-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {session.time} ({session.duration}m)
                  </div>
                </div>

                <div className="hidden md:block text-gray-300">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No sessions found in this category.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
