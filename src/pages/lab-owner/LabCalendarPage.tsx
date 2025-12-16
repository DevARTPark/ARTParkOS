import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { bookingRequests, labAssets } from "../../data/mockLabOwnerData";

export default function LabCalendarPage() {
  // Mocking dates for the current week view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState("week"); // 'day' | 'week'

  // Filter only approved bookings for the calendar
  const approvedBookings = bookingRequests.filter(
    (b) => b.status === "approved" || b.status === "completed"
  );

  // Helper to format dates
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // Generate next 5 days for column headers
  const getDays = () => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(currentDate);
      d.setDate(currentDate.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const days = getDays();

  return (
    <DashboardLayout role="lab_owner" title="Lab Schedule">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Calendar Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              Schedule
            </h1>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() - 5))
                  )
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-4 text-sm font-medium">
                {formatDate(days[0])} - {formatDate(days[4])}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() + 5))
                  )
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              options={[
                { value: "day", label: "Day View" },
                { value: "week", label: "Resource View" },
              ]}
              className="w-40"
            />
            <Button>+ Block Time</Button>
          </div>
        </div>

        {/* Resource Gantt Chart */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <div className="w-64 p-4 font-semibold text-gray-600 border-r border-gray-200 shrink-0">
                  Equipment
                </div>
                {days.map((day, i) => (
                  <div
                    key={i}
                    className="flex-1 p-4 text-center font-medium text-gray-700 border-r border-gray-100 last:border-r-0"
                  >
                    {day.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {labAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Asset Name Column */}
                  <div className="w-64 p-4 border-r border-gray-200 shrink-0 bg-white">
                    <p className="font-semibold text-gray-900">{asset.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {asset.category}
                    </p>
                    <span
                      className={`text-[10px] mt-2 inline-block px-2 py-0.5 rounded-full ${
                        asset.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {asset.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Day Columns */}
                  {days.map((day, i) => {
                    // Check if there's a booking for this asset on this day
                    // Note: Simplified logic comparing simple date strings for the demo
                    const dayBookings = approvedBookings.filter(
                      (b) =>
                        b.equipmentName === asset.name &&
                        new Date(b.date).toDateString() === day.toDateString()
                    );

                    return (
                      <div
                        key={i}
                        className="flex-1 p-2 border-r border-gray-100 last:border-r-0 relative min-h-[100px]"
                      >
                        {dayBookings.map((b) => (
                          <div
                            key={b.id}
                            className="bg-blue-100 border border-blue-200 text-blue-800 p-2 rounded-md text-xs mb-2 shadow-sm cursor-pointer hover:bg-blue-200 transition-colors"
                            title={`${b.startupName} - ${b.purpose}`}
                          >
                            <div className="font-bold truncate">
                              {b.startupName}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" /> {b.duration}h
                            </div>
                          </div>
                        ))}

                        {asset.status === "maintenance" && (
                          <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center">
                            <span className="text-xs text-gray-400 -rotate-12 font-medium border border-gray-300 px-2 py-1 rounded">
                              Maintenance
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
