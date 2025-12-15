import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Search,
  Plus,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Store,
} from "lucide-react";
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

  const remove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const updated = listings.filter((x) => x.id !== id);
    writeListings(updated);
    setListings(updated);
  };

  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = listings.map((x) =>
      x.id === id ? { ...x, published: !x.published } : x
    );
    writeListings(updated);
    setListings(updated);
  };

  return (
    <DashboardLayout role="supplier" title="My Listings">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your listings..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Button
            onClick={() => navigate("/supplier/listings/new")}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Listing
          </Button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((l, index) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden flex flex-col h-full border-gray-200"
                onClick={() => navigate(`/supplier/listings/${l.id}/edit`)}
              >
                {/* Image Area */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {l.images?.[0] ? (
                    <img
                      src={l.images[0]}
                      alt={l.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={l.published ? "success" : "neutral"}
                      className="shadow-sm backdrop-blur-sm bg-white/90"
                    >
                      {l.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">
                        {l.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 leading-relaxed">
                      {l.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-6">
                      <div className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                        {l.currency}{" "}
                        <span className="font-bold">{l.price}</span>
                      </div>
                      <div className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 text-gray-500">
                        MOQ:{" "}
                        <span className="font-medium text-gray-900">
                          {l.moq}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/supplier/listings/${l.id}/edit`);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggle(l.id, e)}
                      >
                        {l.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => remove(l.id, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <Store className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No listings found
              </h3>
              <p className="mb-4">
                Get started by adding your first service or product.
              </p>
              <Button onClick={() => navigate("/supplier/listings/new")}>
                Create Listing
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
