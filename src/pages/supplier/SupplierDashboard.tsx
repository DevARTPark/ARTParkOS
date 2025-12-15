import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
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
import {
  Package,
  Store,
  Star,
  Activity,
  Plus,
  Edit,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { SupplierProfile, Listing } from "./types";

// Mock data keys
const PROFILE_KEY = "artpark_supplier_profile";
const LISTINGS_KEY = "artpark_supplier_listings";
const REVIEWS_KEY = "artpark_supplier_reviews";

// Helper functions to read local storage safely
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

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
    <DashboardLayout role="supplier" title="Supplier Dashboard">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {profile?.name || "Partner"}
            </h2>
            <p className="text-gray-500 mt-1">
              Here's an overview of your store's performance.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate("/supplier/profile/edit")}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => navigate("/supplier/listings/new")}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Listing
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={item}>
            <Card className="h-full border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Listings
                  </p>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    {listings.length}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">
                    {publishedCount} Active • {listings.length - publishedCount}{" "}
                    Drafts
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Profile Visibility
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      {profile?.published ? "Public" : "Hidden"}
                    </span>
                    <Badge variant={profile?.published ? "success" : "warning"}>
                      {profile?.published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Status on platform
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Customer Rating
                  </p>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    {avgRating ?? "—"}
                  </div>
                  <div className="text-xs text-amber-600 font-medium mt-1">
                    Based on {reviews?.length ?? 0} reviews
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Listings Column */}
          <motion.div variants={item}>
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Recent Listings</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/supplier/listings")}
                >
                  View All <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  {listings.slice(0, 5).map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/supplier/listings/${l.id}/edit`)
                      }
                    >
                      <div className="h-12 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                        {l.images?.[0] ? (
                          <img
                            src={l.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {l.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {l.currency ?? "INR"} {l.price ?? "-"}
                        </div>
                      </div>
                      <Badge variant={l.published ? "success" : "neutral"}>
                        {l.published ? "Active" : "Draft"}
                      </Badge>
                    </div>
                  ))}
                  {!listings.length && (
                    <div className="text-center py-10">
                      <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No listings yet.</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-blue-600"
                        onClick={() => navigate("/supplier/listings/new")}
                      >
                        Create one now
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Feed Column */}
          <motion.div variants={item}>
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest reviews from founders</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-6">
                  {reviews.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex gap-4">
                      <div className="mt-1">
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold border border-blue-200">
                          {r.reviewer?.[0] || "U"}
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {r.reviewer}
                          </p>
                          <span className="text-xs text-gray-400">
                            {r.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {r.comment}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= r.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!reviews.length && (
                    <div className="text-center py-10">
                      <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Activity className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        No recent activity.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
