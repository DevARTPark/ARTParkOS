import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { ChevronRight } from "lucide-react";
import type { SupplierProfile, Listing } from "./types";

const PROFILE_KEY = "artpark_supplier_profile";
const LISTINGS_KEY = "artpark_supplier_listings";
const REVIEWS_KEY = "artpark_supplier_reviews";

function readProfile(): SupplierProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}
function readListings(): Listing[] {
  const raw = localStorage.getItem(LISTINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function readReviews() {
  const raw = localStorage.getItem(REVIEWS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export default function SupplierDashboard(): JSX.Element {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    setProfile(readProfile());
    setListings(readListings());
    setReviews(readReviews());
  }, []);

  const publishedCount = useMemo(
    () => listings.filter((l) => l.published).length,
    [listings]
  );
  const avgRating = useMemo(() => {
    if (!reviews?.length) return null;
    const sum = reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Supplier Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview and quick actions for your supplier account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/supplier/profile/edit")}
          >
            Edit Profile
          </Button>
          <Button onClick={() => navigate("/supplier/listings/new")}>
            Create Listing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total listings</CardTitle>
            <CardDescription className="text-muted-foreground">
              Published & draft
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{listings.length}</div>
              <div className="text-sm text-slate-500 mt-1">
                {publishedCount} published
              </div>
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/supplier/listings")}
              >
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription className="text-muted-foreground">
              Visibility & contact
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                {/* avatar uses logo data URL if set */}
                <img
                  src={profile?.logoDataUrl ?? undefined}
                  alt={profile?.name ?? "logo"}
                />
              </Avatar>
              <div>
                <div className="font-medium">
                  {profile?.name ?? "Not completed"}
                </div>
                <div className="text-sm text-slate-500">
                  {profile?.tagline ?? "—"}
                </div>
              </div>
            </div>
            <div>
              <Badge>{profile?.published ? "Published" : "Draft"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ratings</CardTitle>
            <CardDescription className="text-muted-foreground">
              Average customer rating
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{avgRating ?? "—"}</div>
              <div className="text-sm text-slate-500 mt-1">
                {reviews?.length ?? 0} reviews
              </div>
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/supplier/reviews")}
              >
                View reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent listings</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your latest 5 listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {listings.slice(0, 5).map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-medium">{l.title}</div>
                    <div className="text-sm text-slate-500">
                      {l.currency ?? "INR"} {l.price ?? "-"} • MOQ{" "}
                      {l.moq ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate(`/supplier/listings/${l.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() =>
                        window.open(
                          `/suppliers/${profile?.id ?? "preview"}?listing=${
                            l.id
                          }`,
                          "_blank"
                        )
                      }
                    >
                      Preview <ChevronRight className="ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
              {!listings.length && (
                <div className="text-sm text-slate-500">
                  No listings yet — create your first listing.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              Recent reviews & inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviews.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <div className="flex-0">
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-sm text-slate-600">
                      R
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{r.reviewer}</div>
                      <div className="text-xs text-slate-400">{r.date}</div>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {r.comment}
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      Rating: {r.rating}
                    </div>
                  </div>
                </div>
              ))}
              {!reviews.length && (
                <div className="text-sm text-slate-500">
                  No recent activity.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
