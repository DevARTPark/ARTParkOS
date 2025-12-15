import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Globe, Phone, Mail } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import DetailHeader from "../../../components/ui/DetailHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import RFQModal from "../../../components/ui/RFQModal";
import { suppliersApi, Supplier } from "../../../api/portalApi";

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [showRFQ, setShowRFQ] = useState(false);

  useEffect(() => {
    if (id) {
      // Fix: Convert undefined to null
      suppliersApi.getById(id).then((data) => setSupplier(data || null));
    }
  }, [id]);

  if (!supplier)
    return (
      <DashboardLayout role="founder" title="Loading...">
        <div />
      </DashboardLayout>
    );

  return (
    <DashboardLayout role="founder" title={supplier.name}>
      <div className="max-w-6xl mx-auto space-y-6">
        <DetailHeader
          title={supplier.name}
          subtitle={supplier.category}
          backUrl="/founder/suppliers"
          actions={
            <Button onClick={() => setShowRFQ(true)}>Request Quote</Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{supplier.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supplier.capabilities.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4" /> {supplier.contact.email}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4" /> {supplier.contact.phone}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4" /> {supplier.contact.website}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4" /> {supplier.location}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showRFQ && (
          <RFQModal
            supplier={supplier}
            isOpen={showRFQ}
            onClose={() => setShowRFQ(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
