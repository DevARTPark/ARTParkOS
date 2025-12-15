import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Save, Info } from "lucide-react";
import { defaultSchedule, DaySchedule } from "../../data/mockMentorData";

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule);
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
    setSchedule(newSchedule);
  };

  const toggleSlot = (dayIndex: number, slotId: string) => {
    const newSchedule = [...schedule];
    const slot = newSchedule[dayIndex].slots.find((s) => s.id === slotId);
    if (slot) {
      slot.available = !slot.available;
      setSchedule(newSchedule);
    }
  };

  const save = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Schedule updated!");
    }, 800);
  };

  return (
    <DashboardLayout role="mentor" title="My Availability">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Weekly Schedule
            </h1>
            <p className="text-gray-600">
              Set your recurring free time for mentoring sessions.
            </p>
          </div>
          <Button
            onClick={save}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 text-blue-800 text-sm">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p>
            Toggle days on/off and select specific time slots. These slots will
            be visible to founders for booking.
          </p>
        </div>

        <div className="space-y-4">
          {schedule.map((day, dIndex) => (
            <Card
              key={day.day}
              className={day.enabled ? "" : "bg-gray-50 opacity-75"}
            >
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="p-4 md:w-48 border-b md:border-b-0 md:border-r border-gray-100 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{day.day}</span>
                  <div
                    onClick={() => toggleDay(dIndex)}
                    className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                      day.enabled ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${
                        day.enabled ? "translate-x-4" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="p-4 flex-1">
                  {day.enabled ? (
                    <div className="flex flex-wrap gap-3">
                      {day.slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => toggleSlot(dIndex, slot.id)}
                          className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                            slot.available
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Unavailable</span>
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
