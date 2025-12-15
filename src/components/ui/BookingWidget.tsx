import React, { useState, FormEvent } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Card } from "./Card";
import { Textarea } from "./TextArea"; // Using artparkOS existing TextArea

export interface BookingWidgetProps {
  onSubmit: (data: {
    date: string;
    duration: number;
    purpose: string;
    notes?: string;
  }) => Promise<void>;
  minDate?: string;
  durationOptions?: Array<{ value: string; label: string }>;
  isLoading?: boolean;
}

export default function BookingWidget({
  onSubmit,
  minDate,
  durationOptions = [
    { value: "1", label: "1 hour" },
    { value: "2", label: "2 hours" },
    { value: "4", label: "4 hours" },
    { value: "8", label: "Full day (8 hours)" },
  ],
  isLoading = false,
}: BookingWidgetProps) {
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("2");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      date,
      duration: parseInt(duration),
      purpose,
      notes: notes || undefined,
    });
    // Reset form on success
    setDate("");
    setDuration("2");
    setPurpose("");
    setNotes("");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="sticky top-6">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Now</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline h-4 w-4 mr-1 text-gray-500" />
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate || today}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline h-4 w-4 mr-1 text-gray-500" />
              Duration
            </label>
            <Select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              options={durationOptions}
              required
            />
          </div>
          <Input
            label="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Brief description of activity"
            required
          />
          <Textarea
            label="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requirements..."
            rows={3}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Submit Request
          </Button>
        </form>
      </div>
    </Card>
  );
}
