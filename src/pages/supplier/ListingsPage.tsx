import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Listing } from "./types";

const LISTINGS_KEY = "artpark_supplier_listings";
function readListings(): Listing[] {
  const raw = localStorage.getItem(LISTINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function writeListings(arr: Listing[]) {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(arr));
}

export default function ListingsPage(): JSX.Element {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => setListings(readListings()), []);

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(q.toLowerCase())
  );

  const remove = (id: string) => {
    if (!confirm("Delete listing?")) return;
    const updated = listings.filter((x) => x.id !== id);
    writeListings(updated);
    setListings(updated);
  };

  const toggle = (id: string) => {
    const updated = listings.map((x) =>
      x.id === id ? { ...x, published: !x.published } : x
    );
    writeListings(updated);
    setListings(updated);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Your Listings</h1>
          <p className="text-sm text-slate-500">
            Manage your offerings — price, MOQ and status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search title..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button onClick={() => navigate("/supplier/listings/new")}>
            New listing
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-sm text-slate-500 p-4 bg-white rounded border">
            No listings found
          </div>
        )}

        {filtered.map((l) => (
          <Card key={l.id}>
            <CardHeader className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{l.title}</CardTitle>
                <div className="text-sm text-slate-500">
                  {l.currency ?? "INR"} {l.price ?? "-"} • MOQ {l.moq ?? "-"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/supplier/listings/${l.id}/edit`)}
                >
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => toggle(l.id)}>
                  {l.published ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="danger" onClick={() => remove(l.id)}>
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600">{l.description}</div>
              <div className="mt-3 flex gap-2">
                {(l.images || []).slice(0, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`img-${idx}`}
                    className="w-28 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
