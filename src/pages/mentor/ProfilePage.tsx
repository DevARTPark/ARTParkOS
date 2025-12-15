import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { Edit, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { currentMentor } from "../../data/mockMentorData";

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="mentor" title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 backdrop-blur"
              onClick={() => navigate("/mentor/profile/edit")}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          </div>
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6 flex justify-between items-end">
              <Avatar className="w-32 h-32 border-4 border-white shadow-md bg-white">
                <span className="text-3xl font-bold text-gray-400">
                  {currentMentor.name[0]}
                </span>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentMentor.name}
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  {currentMentor.title}
                </p>
                <p className="text-gray-500">{currentMentor.affiliation}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {currentMentor.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {currentMentor.phone}
                </div>
                <div className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                  <Linkedin className="w-4 h-4" /> LinkedIn Profile
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">About Me</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {currentMentor.bio}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentMentor.expertise.map((skill) => (
                    <Badge
                      key={skill}
                      variant="neutral"
                      className="bg-gray-100 text-gray-700 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
