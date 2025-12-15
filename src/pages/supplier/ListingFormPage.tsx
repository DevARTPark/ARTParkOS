import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/TextArea";
import { Button } from "../../components/ui/Button";
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

  const save = () => {
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
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{id ? "Edit Listing" : "New Listing"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-slate-600">Title</label>
                <Input
                  value={listing.title}
                  onChange={(e) =>
                    setListing({ ...listing, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600">
                  Short description
                </label>
                <Textarea
                  value={listing.description}
                  onChange={(e) =>
                    setListing({ ...listing, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  placeholder="Price"
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
                <Input
                  placeholder="Currency"
                  value={listing.currency}
                  onChange={(e) =>
                    setListing({ ...listing, currency: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="MOQ"
                  value={listing.moq ?? ""}
                  onChange={(e) =>
                    setListing({
                      ...listing,
                      moq: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600">Images</label>
                <input type="file" accept="image/*" onChange={addImage} />
                <div className="mt-3 flex gap-2 flex-wrap">
                  {(listing.images || []).map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt={`img-${i}`}
                        className="w-28 h-20 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/supplier/listings")}
                >
                  Cancel
                </Button>
                <Button onClick={save}>Save Listing</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
