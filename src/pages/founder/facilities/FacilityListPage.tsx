import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, AlertTriangle } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar, { Filter } from "../../../components/ui/FilterBar";
import { Select } from "../../../components/ui/Select";
import ListSkeleton from "../../../components/ui/ListSkeleton";
import { Button } from "../../../components/ui/Button";
import { equipmentApi, Equipment } from "../../../api/portalApi";

export default function FacilityListPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    loadEquipment();
  }, [searchQuery, categoryFilter, locationFilter]);

  const loadEquipment = async () => {
    setIsLoading(true);
    try {
      let data: Equipment[];
      if (searchQuery) {
        data = await equipmentApi.search(searchQuery);
      } else {
        data = await equipmentApi.getAll();
      }

      if (categoryFilter !== "all") {
        data = data.filter((e) => e.category === categoryFilter);
      }
      if (locationFilter !== "all") {
        data = data.filter((e) => e.location.includes(locationFilter));
      }

      setEquipment(data);
    } catch (error) {
      console.error("Failed to load equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    if (value !== "all") {
      setFilters((prev) => {
        const filtered = prev.filter((f) => f.key !== "category");
        return [...filtered, { key: "category", label: "Category", value }];
      });
    } else {
      setFilters((prev) => prev.filter((f) => f.key !== "category"));
    }
  };

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    if (value !== "all") {
      setFilters((prev) => {
        const filtered = prev.filter((f) => f.key !== "location");
        return [...filtered, { key: "location", label: "Location", value }];
      });
    } else {
      setFilters((prev) => prev.filter((f) => f.key !== "location"));
    }
  };

  const removeFilter = (key: string) => {
    if (key === "category") setCategoryFilter("all");
    if (key === "location") setLocationFilter("all");
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const clearAllFilters = () => {
    setCategoryFilter("all");
    setLocationFilter("all");
    setFilters([]);
  };

  const categories = Array.from(new Set(equipment.map((e) => e.category)));
  const locations = Array.from(new Set(equipment.map((e) => e.location)));

  return (
    <DashboardLayout role="founder" title="In-House Facilities">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Equipment Booking
          </h1>
          <p className="text-gray-600 mt-1">
            Reserve in-house equipment and manufacturing facilities.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search equipment by name, category..."
              onSearch={setSearchQuery}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              options={[
                { value: "all", label: "All Categories" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
              className="w-48"
            />
            <Select
              value={locationFilter}
              onChange={(e) => handleLocationChange(e.target.value)}
              options={[
                { value: "all", label: "All Locations" },
                ...locations.map((l) => ({ value: l, label: l })),
              ]}
              className="w-48"
            />
          </div>
        </div>

        <FilterBar
          filters={filters}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />

        {isLoading ? (
          <ListSkeleton count={5} />
        ) : equipment.length === 0 ? (
          <Card className="p-12 text-center text-gray-500">
            No equipment found. Try adjusting your search or filters.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        item.availability === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.availability}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>

                  {item.safetyNotes && (
                    <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-100 rounded mb-4">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <p className="text-xs text-amber-800 line-clamp-2">
                        {item.safetyNotes}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <Link to={`/founder/facilities/${item.id}`}>
                      <Button variant="secondary" size="sm" className="w-full">
                        View Details →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
