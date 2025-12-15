import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Mail, Calendar } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import DetailHeader from "../../../components/ui/DetailHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import BookingWidget from "../../../components/ui/BookingWidget";
import { mentorsApi, bookingApi, Mentor } from "../../../api/portalApi";

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (id) {
      // Fix: Convert undefined to null
      mentorsApi.getById(id).then((data) => setMentor(data || null));
    }
  }, [id]);

  const handleBooking = async (data: {
    date: string;
    duration: number;
    purpose: string;
  }) => {
    if (!mentor) return;
    setIsBooking(true);
    await bookingApi.createMentorBooking({
      mentorId: mentor.id,
      date: data.date,
      duration: data.duration,
      topic: data.purpose,
    });
    alert("Mentor session booked successfully!");
    setIsBooking(false);
  };

  if (!mentor)
    return (
      <DashboardLayout role="founder" title="Loading...">
        <div />
      </DashboardLayout>
    );

  return (
    <DashboardLayout role="founder" title={mentor.name}>
      <div className="max-w-6xl mx-auto space-y-6">
        <DetailHeader
          title={mentor.name}
          subtitle={mentor.title}
          backUrl="/founder/mentors"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{mentor.bio}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((e) => (
                    <span
                      key={e}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a href={`mailto:${mentor.email}`} className="text-blue-600">
                  {mentor.email}
                </a>
              </CardContent>
            </Card>
            <BookingWidget onSubmit={handleBooking} isLoading={isBooking} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
