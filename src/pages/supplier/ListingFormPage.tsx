import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { Input, Textarea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, Save, Upload, X, DollarSign, Package } from "lucide-react";
import { Listing } from "./types";

const LISTINGS_KEY = "artpark_supplier_listings";

function readListings(): Listing[] {
  const raw = localStorage.getItem(LISTINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function writeListings(arr: Listing[]) {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(arr));
}

export default function ListingFormPage(): JSX.Element {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing>({
    id: id ?? `listing_${Date.now()}`,
    title: "",
    description: "",
    price: undefined,
    currency: "INR",
    moq: undefined,
    images: [],
    specs: [],
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (id) {
      const found = readListings().find((l) => l.id === id);
      if (found) setListing(found);
    }
  }, [id]);

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () =>
      setListing((s) => ({
        ...s,
        images: [...(s.images || []), String(r.result)],
      }));
    r.readAsDataURL(f);
  };

  const removeImage = (index: number) => {
    setListing((s) => ({
      ...s,
      images: s.images?.filter((_, i) => i !== index),
    }));
  };

  const save = () => {
    // Basic validation
    if (!listing.title) {
      alert("Please enter a listing title");
      return;
    }

    const all = readListings();
    const updatedAt = new Date().toISOString();
    const toSave = { ...listing, updatedAt };

    const exists = all.find((x) => x.id === listing.id);
    if (exists) {
      writeListings(all.map((x) => (x.id === listing.id ? toSave : x)));
    } else {
      writeListings([toSave, ...all]);
    }
    navigate("/supplier/listings");
  };

  return (
    <DashboardLayout
      role="supplier"
      title={id ? "Edit Listing" : "Create Listing"}
    >
      <div className="max-w-5xl mx-auto pb-10">
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/supplier/listings")}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Listings
          </Button>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate("/supplier/listings")}
            >
              Cancel
            </Button>
            <Button onClick={save} leftIcon={<Save className="w-4 h-4" />}>
              Save Listing
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Details</CardTitle>
                <CardDescription>
                  Provide the core information about your service or product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Input
                  label="Title"
                  placeholder="e.g. High Precision CNC Milling - 5 Axis"
                  value={listing.title}
                  onChange={(e) =>
                    setListing({ ...listing, title: e.target.value })
                  }
                />
                <Textarea
                  label="Description"
                  placeholder="Describe capabilities, materials, tolerances, and typical use cases..."
                  value={listing.description}
                  onChange={(e) =>
                    setListing({ ...listing, description: e.target.value })
                  }
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <Input
                      label="Price (Per Unit/Hour)"
                      type="number"
                      placeholder="0.00"
                      value={listing.price ?? ""}
                      onChange={(e) =>
                        setListing({
                          ...listing,
                          price: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                    <div className="absolute right-3 top-[34px] text-gray-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>

                  <Input
                    label="Currency"
                    placeholder="INR"
                    value={listing.currency}
                    onChange={(e) =>
                      setListing({ ...listing, currency: e.target.value })
                    }
                  />

                  <div className="relative">
                    <Input
                      label="Min. Order Quantity (MOQ)"
                      type="number"
                      placeholder="1"
                      value={listing.moq ?? ""}
                      onChange={(e) =>
                        setListing({
                          ...listing,
                          moq: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                    <div className="absolute right-3 top-[34px] text-gray-400">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Media & Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {(listing.images || []).map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 text-red-600 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 font-medium">
                      Add Image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={addImage}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400">
                  First image will be used as the cover. Support: JPG, PNG.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    listing.published
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setListing({ ...listing, published: !listing.published })
                  }
                >
                  <div>
                    <span
                      className={`block text-sm font-bold ${
                        listing.published ? "text-green-800" : "text-gray-700"
                      }`}
                    >
                      {listing.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block">
                      {listing.published
                        ? "Visible to everyone"
                        : "Hidden from search"}
                    </span>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full p-1 transition-colors ${
                      listing.published ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        listing.published ? "translate-x-4" : ""
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
