import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, AlertTriangle, Calendar } from "lucide-react";
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
import { equipmentApi, bookingApi, Equipment } from "../../../api/portalApi";

export default function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (id) {
      loadEquipment();
    }
  }, [id]);

  const loadEquipment = async () => {
    setIsLoading(true);
    try {
      const data = await equipmentApi.getById(id!);
      setEquipment(data || null);
    } catch (error) {
      console.error("Failed to load equipment:", error);
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
    if (!equipment) return;
    setIsBooking(true);
    try {
      await bookingApi.createFacilityBooking({
        equipmentId: equipment.id,
        date: data.date,
        duration: data.duration,
        purpose: data.purpose,
      });
      window.location.href = `/founder/facilities/${equipment.id}/booking?success=true`;
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

  if (!equipment) {
    return (
      <DashboardLayout role="founder" title="Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-900">
            Equipment not found
          </h2>
          <Link
            to="/founder/facilities"
            className="text-blue-600 hover:underline mt-2"
          >
            Back to Facilities
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="founder" title={equipment.name}>
      <div className="max-w-6xl mx-auto space-y-6">
        <DetailHeader
          title={equipment.name}
          subtitle={equipment.category}
          backUrl="/founder/facilities"
          actions={
            <Link to={`/founder/facilities/${equipment.id}/booking`}>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {equipment.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(equipment.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                      >
                        <dt className="text-xs font-semibold text-gray-500 uppercase">
                          {key}
                        </dt>
                        <dd className="text-sm text-gray-900 mt-1">{value}</dd>
                      </div>
                    )
                  )}
                </dl>
              </CardContent>
            </Card>

            {equipment.safetyNotes && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Safety Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-800">
                    {equipment.safetyNotes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Location
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {equipment.location}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                        equipment.availability === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {equipment.availability}
                    </span>
                  </div>
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
