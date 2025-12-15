import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import SearchBar from "../../../components/ui/SearchBar";
import ListSkeleton from "../../../components/ui/ListSkeleton";
import { Button } from "../../../components/ui/Button";
import { suppliersApi, Supplier } from "../../../api/portalApi";

export default function SupplierListPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadData();
  }, [query]);

  const loadData = async () => {
    setIsLoading(true);
    const data = query
      ? await suppliersApi.search(query)
      : await suppliersApi.getAll();
    setSuppliers(data);
    setIsLoading(false);
  };

  return (
    <DashboardLayout role="founder" title="Suppliers">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Supplier Network</h1>
          <div className="w-64">
            <SearchBar onSearch={setQuery} />
          </div>
        </div>

        {isLoading ? (
          <ListSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map((s) => (
              <Link key={s.id} to={`/founder/suppliers/${s.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{s.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{" "}
                        {s.rating}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{s.category}</p>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {s.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4" /> {s.location}
                    </div>
                    <Button variant="secondary" className="w-full">
                      View Details
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
