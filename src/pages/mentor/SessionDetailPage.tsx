import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/TextArea";
import { mentorSessions } from "../../data/mockMentorData";
import {
  Video,
  Calendar,
  Clock,
  User,
  Upload,
  ArrowLeft,
  Save,
} from "lucide-react";

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = mentorSessions.find((s) => s.id === id);
  const [notes, setNotes] = useState(session?.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!session) return <div className="p-8">Session not found</div>;

  const saveNotes = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Notes uploaded successfully!");
    }, 1000);
  };

  return (
    <DashboardLayout role="mentor" title="Session Details">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/mentor/sessions")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Sessions
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{session.topic}</CardTitle>
                <p className="text-gray-500 text-sm">
                  Meeting ID: {session.id}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg flex-1">
                    <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                      <Calendar className="w-4 h-4" /> Date
                    </div>
                    <div className="text-gray-900">
                      {new Date(session.date).toDateString()}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg flex-1">
                    <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                      <Clock className="w-4 h-4" /> Time
                    </div>
                    <div className="text-gray-900">
                      {session.time} ({session.duration} mins)
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Founder Profile
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">
                      {session.founderName}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Founder, {session.startupName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Seeking guidance on sensor integration and path planning
                      logic for autonomous drones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Notes & Outcomes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  label="Key Takeaways"
                  placeholder="Summarize the advice given and next steps..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                />

                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Attach Documents
                  </span>
                  <span className="text-xs text-gray-400">
                    PDF, DOCX, or Images
                  </span>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={saveNotes}
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Link</CardTitle>
              </CardHeader>
              <CardContent>
                {session.meetingLink ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 break-all">
                      {session.meetingLink}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => window.open(session.meetingLink, "_blank")}
                    >
                      <Video className="w-4 h-4 mr-2" /> Launch Meeting
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No link generated yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
