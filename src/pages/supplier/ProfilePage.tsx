import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { MapPin, Globe, Mail, Phone, Edit3, Building2 } from "lucide-react";
import type { SupplierProfile } from "./types";

const PROFILE_KEY = "artpark_supplier_profile";
const REVIEWS_KEY = "artpark_supplier_reviews";

function readProfile(): SupplierProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}
function readReviews() {
  const raw = localStorage.getItem(REVIEWS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export default function ProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    setProfile(readProfile());
    setReviews(readReviews());
  }, []);

  if (!profile) {
    return (
      <DashboardLayout role="supplier" title="Profile">
        <div className="p-10 text-center text-gray-500">
          Loading profile data...
        </div>
      </DashboardLayout>
    );
  }

  const avg = reviews.length
    ? (
        reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
      ).toFixed(1)
    : "—";

  return (
    <DashboardLayout role="supplier" title="Company Profile">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Banner & Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative group">
          <div className="h-56 bg-gradient-to-r from-slate-700 to-slate-900 relative">
            {profile.bannerDataUrl ? (
              <img
                src={profile.bannerDataUrl}
                alt="banner"
                className="w-full h-full object-cover opacity-90"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-10">
                <Building2 className="w-24 h-24 text-white" />
              </div>
            )}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 backdrop-blur-sm shadow-sm"
                onClick={() => navigate("/supplier/profile/edit")}
                leftIcon={<Edit3 className="w-3 h-3" />}
              >
                Edit Design
              </Button>
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-end -mt-12 mb-6 relative">
              <div className="p-1.5 bg-white rounded-2xl shadow-lg">
                <Avatar className="w-32 h-32 rounded-xl bg-gray-50 border border-gray-100">
                  {profile.logoDataUrl ? (
                    <img
                      src={profile.logoDataUrl}
                      alt={profile.name}
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-400">
                      {profile.name.substring(0, 2)}
                    </span>
                  )}
                </Avatar>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                  {profile.published && (
                    <Badge variant="success" className="text-xs px-2 py-0.5">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-gray-500 font-medium">
                  {profile.tagline || "Add a tagline to describe your business"}
                </p>
              </div>
              <div className="hidden md:flex gap-6 pb-2 text-center">
                <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.length}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Reviews
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-1 justify-center">
                    <p className="text-2xl font-bold text-gray-900">{avg}</p>
                    <span className="text-amber-400 text-lg">★</span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Rating
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600 pt-2 border-t border-gray-100 mt-6">
              {profile.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> {profile.address}
                </div>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-400" />{" "}
                  {new URL(profile.website).hostname}
                </a>
              )}
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> {profile.email}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Company</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {profile.about ||
                    "No company description added yet. Edit your profile to add one."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profile.capabilities || []).map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {c}
                    </span>
                  ))}
                  {!profile.capabilities?.length && (
                    <p className="text-gray-400 italic text-sm">
                      No specific capabilities listed.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Reviews</CardTitle>
                {reviews.length > 0 && (
                  <span className="text-sm text-gray-500">Latest</span>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {reviews.slice(0, 3).map((r: any) => (
                    <div
                      key={r.id}
                      className="pb-5 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {r.reviewer}
                        </p>
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                      <div className="flex text-amber-400 text-xs mb-2">
                        {"★".repeat(r.rating)}
                        <span className="text-gray-200">
                          {"★".repeat(5 - r.rating)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed bg-gray-50 p-2 rounded-lg">
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
                  {!reviews.length && (
                    <div className="text-sm text-gray-400 text-center py-4">
                      No reviews received yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <CardContent className="p-6">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Need to update info?
                </h4>
                <p className="text-xs text-blue-700 mb-4">
                  Keep your profile up to date to attract more founders.
                </p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 border-none"
                  size="sm"
                  onClick={() => navigate("/supplier/profile/edit")}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
