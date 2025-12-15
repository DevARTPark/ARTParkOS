import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import DetailHeader from "../../../components/ui/DetailHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { softwareApi, Software } from "../../../api/portalApi";

export default function SoftwareDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sw, setSw] = useState<Software | null>(null);

  useEffect(() => {
    if (id) {
      // Fix: Convert undefined to null
      softwareApi.getById(id).then((data) => setSw(data || null));
    }
  }, [id]);

  if (!sw)
    return (
      <DashboardLayout role="founder" title="Loading...">
        <div />
      </DashboardLayout>
    );

  return (
    <DashboardLayout role="founder" title={sw.name}>
      <div className="max-w-6xl mx-auto space-y-6">
        <DetailHeader
          title={sw.name}
          subtitle={sw.category}
          backUrl="/founder/software"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{sw.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {sw.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <Button
                  className="w-full"
                  onClick={() => alert("Request sent!")}
                >
                  Request Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
