import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import SearchBar from "../../../components/ui/SearchBar";
import ListSkeleton from "../../../components/ui/ListSkeleton";
import { Button } from "../../../components/ui/Button";
import { softwareApi, Software } from "../../../api/portalApi";

export default function SoftwareListPage() {
  const [software, setSoftware] = useState<Software[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadData();
  }, [query]);

  const loadData = async () => {
    setIsLoading(true);
    const data = query
      ? await softwareApi.search(query)
      : await softwareApi.getAll();
    setSoftware(data);
    setIsLoading(false);
  };

  return (
    <DashboardLayout role="founder" title="Software Licenses">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Software Catalog</h1>
          <div className="w-64">
            <SearchBar onSearch={setQuery} />
          </div>
        </div>

        {isLoading ? (
          <ListSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {software.map((sw) => (
              <Link key={sw.id} to={`/founder/software/${sw.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{sw.name}</h3>
                        <p className="text-sm text-gray-500">{sw.category}</p>
                      </div>
                      <Package className="text-blue-500 h-8 w-8" />
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {sw.description}
                    </p>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {sw.licenseType}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {sw.availability}
                      </span>
                    </div>
                    <Button variant="ghost" className="w-full">
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
