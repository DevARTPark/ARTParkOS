import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
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
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    setProfile(readProfile());
    setReviews(readReviews());
  }, []);

  if (!profile) {
    return <div className="p-6">Supplier profile not available.</div>;
  }

  const avg = reviews.length
    ? (
        reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
      ).toFixed(1)
    : "—";

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="rounded-lg overflow-hidden bg-white shadow">
        {profile.bannerDataUrl ? (
          <img
            src={profile.bannerDataUrl}
            alt="banner"
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="h-44 bg-slate-50" />
        )}
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <img src={profile.logoDataUrl ?? undefined} alt={profile.name} />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{profile.name}</h1>
                <Badge>{profile.published ? "Verified" : "Draft"}</Badge>
              </div>
              <p className="text-sm text-slate-500 mt-1">{profile.tagline}</p>
              <div className="text-sm text-slate-400 mt-2">
                {profile.address}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold">{avg}</div>
              <div className="text-sm text-slate-500">
                {reviews.length} reviews
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent>
                <h3 className="font-semibold">About</h3>
                <p className="text-sm text-slate-600 mt-2">{profile.about}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold">Capabilities</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(profile.capabilities || []).map((c) => (
                    <span
                      key={c}
                      className="text-sm bg-slate-100 px-2 py-1 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold">Contact</h3>
                <div className="mt-2 text-sm text-slate-600">
                  <div>
                    Email:{" "}
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-blue-600"
                    >
                      {profile.email}
                    </a>
                  </div>
                  <div>Phone: {profile.phone}</div>
                  <div>
                    Website:{" "}
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Customer Reviews</h3>
            <div className="mt-3 space-y-3">
              {reviews.map((r: any) => (
                <div key={r.id} className="p-3 border rounded">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{r.reviewer}</div>
                    <div className="text-xs text-slate-400">{r.date}</div>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{r.comment}</div>
                  <div className="text-xs text-yellow-600 mt-1">
                    Rating: {r.rating}
                  </div>
                </div>
              ))}
              {!reviews.length && (
                <div className="text-sm text-slate-500">No reviews yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
