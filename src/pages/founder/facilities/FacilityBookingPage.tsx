import React from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Calendar } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import DetailHeader from "../../../components/ui/DetailHeader";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export default function FacilityBookingPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  if (isSuccess) {
    return (
      <DashboardLayout role="founder" title="Booking Confirmed">
        <div className="max-w-2xl mx-auto space-y-6">
          <DetailHeader
            title="Request Submitted"
            backUrl="/founder/facilities"
          />
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Equipment Reserved
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your booking request has been submitted. You'll receive a
                confirmation email once the facility manager approves it.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/founder/facilities">
                  <Button variant="secondary">Back to Facilities</Button>
                </Link>
                <Link to="/founder/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="founder" title="Book Facility">
      <div className="max-w-2xl mx-auto space-y-6">
        <DetailHeader
          title="Book Equipment"
          backUrl={`/founder/facilities/${id}`}
        />
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Booking Widget
            </h2>
            <p className="text-gray-600 mb-6">
              Please use the booking widget on the equipment detail page to
              submit your request.
            </p>
            <Link to={`/founder/facilities/${id}`}>
              <Button>Go to Equipment Details</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
