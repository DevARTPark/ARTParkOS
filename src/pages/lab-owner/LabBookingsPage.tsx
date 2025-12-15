import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Check, X, Calendar, Clock, User } from "lucide-react";
import { bookingRequests } from "../../data/mockLabOwnerData";

export default function LabBookingsPage() {
  const [requests, setRequests] = useState(bookingRequests);

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action } : req))
    );
  };

  return (
    <DashboardLayout role="lab_owner" title="Booking Management">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Lab Booking Requests
        </h1>

        <div className="space-y-4">
          {requests.map((req) => (
            <Card
              key={req.id}
              className="border-l-4 border-l-transparent hover:border-l-blue-500 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info Section */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {req.startupName}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="w-3 h-3" /> Founder:{" "}
                          {req.founderName}
                        </p>
                      </div>
                      <Badge
                        variant={
                          req.status === "approved"
                            ? "success"
                            : req.status === "rejected"
                            ? "danger"
                            : "neutral"
                        }
                      >
                        {req.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-700 font-medium">
                        Requested: {req.equipmentName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        "{req.purpose}"
                      </p>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />{" "}
                        {new Date(req.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {req.duration} Hours
                      </span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  {req.status === "pending" && (
                    <div className="flex md:flex-col justify-center gap-2 md:w-32 md:border-l border-gray-100 md:pl-6">
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(req.id, "approved")}
                      >
                        <Check className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleAction(req.id, "rejected")}
                      >
                        <X className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
