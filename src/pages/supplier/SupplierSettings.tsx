import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import {
  User,
  Building2,
  Bell,
  Shield,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";

// Mock data locally if not exported from data file yet
const currentSupplier = {
  id: "sup-1",
  name: "Vikram Singh",
  role: "Sales Director",
  companyName: "Precision Components Ltd",
  email: "vikram@precision.com",
  phone: "+91-98765-12345",
  location: "Pune, Maharashtra",
  website: "https://precision-components.com",
  description:
    "Leading manufacturer of aerospace-grade aluminum parts and CNC machined components.",
};

export default function SupplierSettings() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <DashboardLayout role="supplier" title="Settings">
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64">
          <Card>
            <CardContent className="p-2 space-y-1">
              {[
                { id: "general", label: "Company Profile", icon: Building2 },
                { id: "account", label: "Account Manager", icon: User },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "security", label: "Security", icon: Shield },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      activeTab === item.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Company Profile Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Company Name"
                    defaultValue={currentSupplier.companyName}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Website"
                      defaultValue={currentSupplier.website}
                      leftIcon={<Globe className="w-4 h-4" />}
                    />
                    <Input
                      label="Location"
                      defaultValue={currentSupplier.location}
                      leftIcon={<MapPin className="w-4 h-4" />}
                    />
                  </div>
                  <Textarea
                    label="About Company"
                    rows={4}
                    defaultValue={currentSupplier.description}
                  />
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button>Save Company Profile</Button>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Representative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {currentSupplier.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{currentSupplier.name}</h4>
                    <p className="text-sm text-gray-500">
                      {currentSupplier.role}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    defaultValue={currentSupplier.name}
                  />
                  <Input
                    label="Job Title"
                    defaultValue={currentSupplier.role}
                  />
                  <Input
                    label="Work Email"
                    defaultValue={currentSupplier.email}
                    disabled
                  />
                  <Input label="Phone" defaultValue={currentSupplier.phone} />
                </div>
                <div className="flex justify-end mt-4">
                  <Button>Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "New RFQ Received",
                    "Order Updates",
                    "Platform Announcements",
                  ].map((item, i) => (
                    <label
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-700">{item}</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Login & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Password
                      </p>
                      <p className="text-xs text-gray-500">
                        Last changed 2 months ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
