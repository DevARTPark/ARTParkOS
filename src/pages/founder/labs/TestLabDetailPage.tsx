import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Mail, Phone, Calendar } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import DetailHeader from "../../../components/ui/DetailHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import BookingWidget from "../../../components/ui/BookingWidget";
import ListSkeleton from "../../../components/ui/ListSkeleton";
import { labsApi, bookingApi, Lab } from "../../../api/portalApi";

export default function TestLabDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (id) {
      loadLab();
    }
  }, [id]);

  const loadLab = async () => {
    setIsLoading(true);
    try {
      const data = await labsApi.getById(id!);
      setLab(data || null);
    } catch (error) {
      console.error("Failed to load lab:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (data: {
    date: string;
    duration: number;
    purpose: string;
    notes?: string;
  }) => {
    if (!lab) return;
    setIsBooking(true);
    try {
      await bookingApi.createLabBooking({
        labId: lab.id,
        date: data.date,
        duration: data.duration,
        purpose: data.purpose,
      });
      // Navigate to booking confirmation
      window.location.href = `/founder/labs/${lab.id}/booking?success=true`;
    } catch (error) {
      console.error("Failed to create booking:", error);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="founder" title="Loading...">
        <div className="max-w-5xl mx-auto">
          <ListSkeleton count={1} itemHeight="h-64" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lab) {
    return (
      <DashboardLayout role="founder" title="Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-900">Lab not found</h2>
          <Link
            to="/founder/labs"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Back to Labs
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="founder" title={lab.name}>
      <div className="max-w-6xl mx-auto space-y-6">
        <DetailHeader
          title={lab.name}
          subtitle={lab.location}
          backUrl="/founder/labs"
          actions={
            <Link to={`/founder/labs/${lab.id}/booking`}>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {lab.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lab.testTypes.map((type, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm font-medium bg-green-50 text-green-700 rounded-lg border border-green-100"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lab.facilities.map((facility, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      {facility}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <a
                    href={`mailto:${lab.contact.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {lab.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {lab.contact.phone}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{lab.location}</span>
                </div>
              </CardContent>
            </Card>

            <BookingWidget onSubmit={handleBooking} isLoading={isBooking} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
