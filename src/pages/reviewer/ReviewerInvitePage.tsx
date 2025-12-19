import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Mail,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Layout,
  Shield,
  Users,
  Building2,
  Calendar,
  Lock,
} from "lucide-react";

export function ReviewerInvitePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("founder");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Configuration for the Role Selection Cards
  const roles = [
    {
      id: "admin", // --- ADDED ADMIN ROLE ---
      label: "Admin",
      icon: Lock,
      desc: "Full platform access and management rights.",
    },
    {
      id: "founder",
      label: "Founder",
      icon: Layout,
      desc: "Startup founder access to assessment tools.",
    },
    {
      id: "mentor",
      label: "Mentor",
      icon: Calendar,
      desc: "Expert who provides guidance and hours.",
    },
    {
      id: "supplier",
      label: "Supplier",
      icon: Users,
      desc: "Vendor listing products in the marketplace.",
    },
    {
      id: "lab_owner",
      label: "Lab Owner",
      icon: Building2,
      desc: "Facility manager listing equipment.",
    },
    {
      id: "reviewer",
      label: "Reviewer",
      icon: Shield,
      desc: "Internal program team member.",
    },
  ];

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("http://localhost:3000/api/auth/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invite");

      setStatus({
        type: "success",
        msg: `Invitation sent successfully to ${email}!`,
      });
      setEmail(""); // Reset form
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="reviewer" title="User Management">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Invite New Members
          </h1>
          <p className="text-gray-500 mt-2">
            Send email invitations to onboard new stakeholders into the ARTPark
            ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: The Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span>Invitation Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvite} className="space-y-6">
                  {/* Status Message */}
                  {status && (
                    <div
                      className={`p-4 rounded-lg flex items-start space-x-3 ${
                        status.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {status.type === "success" ? (
                        <CheckCircle className="w-5 h-5 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">
                          {status.type === "success" ? "Success" : "Error"}
                        </p>
                        <p className="text-sm opacity-90">{status.msg}</p>
                      </div>
                    </div>
                  )}

                  {/* Role Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Role
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roles.map((r) => {
                        const Icon = r.icon;
                        const isSelected = role === r.id;
                        return (
                          <div
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2 rounded-lg ${
                                    isSelected
                                      ? "bg-blue-200 text-blue-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <p
                                    className={`font-semibold ${
                                      isSelected
                                        ? "text-blue-900"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {r.label}
                                  </p>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-3 ml-1">
                              {r.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="new.member@artpark.in"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-1">
                      They will receive an email with a secure link to activate
                      their account.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>Sending Invitation...</span>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send Activation Email</span>
                      </>
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Information / Help */}
          <div className="space-y-6">
            <Card className="bg-blue-900 text-white border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">How it works</h3>
                <ul className="space-y-3 text-sm text-blue-100">
                  <li className="flex items-start space-x-2">
                    <span className="font-bold bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>You send an invite to the user's email.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      2
                    </span>
                    <span>User clicks the unique link (valid for 24h).</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      3
                    </span>
                    <span>User sets their password and logs in.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">
                    Note on Roles
                  </h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    <strong>Founders</strong> get access to assessment tools.
                    <br />
                    <strong>Reviewers</strong> have admin privileges.
                    <br />
                    Ensure you select the correct role before sending.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
