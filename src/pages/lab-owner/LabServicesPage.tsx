import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Plus, Settings, AlertTriangle } from "lucide-react";
import { labAssets, LabAsset } from "../../data/mockLabOwnerData";

export default function LabServicesPage() {
  const [assets, setAssets] = useState<LabAsset[]>(labAssets);

  const toggleStatus = (id: string) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "maintenance" : "active" }
          : a
      )
    );
  };

  return (
    <DashboardLayout role="lab_owner" title="Equipment & Services">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Inventory</h1>
            <p className="text-gray-600">
              Manage your equipment status and listings visible to founders.
            </p>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Add New Equipment
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-gray-500">{asset.category}</p>
                    </div>
                    <Badge
                      variant={asset.status === "active" ? "success" : "danger"}
                    >
                      {asset.status === "active" ? "Active" : "Maintenance"}
                    </Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {asset.specifications.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 md:w-64 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100">
                  <div className="text-center mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{asset.hourlyRate}
                    </span>
                    <span className="text-sm text-gray-500">/hour</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Settings className="w-3 h-3" />}
                  >
                    Edit Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      asset.status === "active"
                        ? "text-orange-600 hover:bg-orange-50"
                        : "text-green-600 hover:bg-green-50"
                    }
                    onClick={() => toggleStatus(asset.id)}
                  >
                    {asset.status === "active"
                      ? "Mark for Maintenance"
                      : "Set as Active"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
