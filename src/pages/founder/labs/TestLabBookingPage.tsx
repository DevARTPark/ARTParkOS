import React from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Calendar } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import DetailHeader from "../../../components/ui/DetailHeader";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export default function TestLabBookingPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  if (isSuccess) {
    return (
      <DashboardLayout role="founder" title="Booking Confirmed">
        <div className="max-w-2xl mx-auto space-y-6">
          <DetailHeader title="Request Submitted" backUrl="/founder/labs" />
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Booking Request Sent
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your request has been submitted to the lab manager. You will
                receive a confirmation email with the final slot details
                shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/founder/labs">
                  <Button variant="secondary">Back to Labs</Button>
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
    <DashboardLayout role="founder" title="Book Lab">
      <div className="max-w-2xl mx-auto space-y-6">
        <DetailHeader title="Book Test Lab" backUrl={`/founder/labs/${id}`} />
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Booking Widget
            </h2>
            <p className="text-gray-600 mb-6">
              Please use the booking widget on the main lab details page to
              submit your request.
            </p>
            <Link to={`/founder/labs/${id}`}>
              <Button>Go to Lab Details</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
