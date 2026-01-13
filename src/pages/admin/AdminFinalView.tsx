import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Quote, Shield } from "lucide-react";
import { API_URL } from "../../config";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import ApplicationFullView from "../../components/common/ApplicationFullView";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function AdminFinalView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appData, setAppData] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [expertReview, setExpertReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        // 1. App Data
        const appRes = await fetch(
          `${API_URL}/api/onboarding/application?userId=${id}`
        );
        setAppData(await appRes.json());

        // 2. Assessments (Mocking Team Data for display)
        setAssessments([
          {
            userId: id,
            totalScore: 82,
            dimensionScores: {
              strategy: 19,
              culture: 15,
              operations: 16,
              mindset: 17,
              tactics: 18,
            },
          },
        ]);

        // 3. Expert Review (Mock)
        setExpertReview({
          expertName: "Dr. Ramesh Rao",
          decision: "APPROVED",
          comments:
            "This team shows exceptional maturity in their strategy. Technical risks are well mitigated.",
          date: "Oct 27, 2023",
        });
      } catch (error) {
        console.error("Failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    if (
      !window.confirm(
        `Are you sure you want to ${status} this startup? This action is final.`
      )
    )
      return;
    setIsProcessing(true);
    // API Call here...
    setTimeout(() => {
      alert(`Startup ${status}`);
      navigate("/admin/onboarding");
    }, 1000);
  };

  if (isLoading)
    return (
      <DashboardLayout role="admin">
        <div className="p-12 text-center">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
        {/* HEADER */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-20">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> Final Onboarding
                Decision
              </h1>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleDecision("REJECTED")}
              disabled={isProcessing}
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject Application
            </Button>
            <Button
              className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
              onClick={() => handleDecision("APPROVED")}
              isLoading={isProcessing}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Approve & Onboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN VIEW */}
          <div className="lg:col-span-2">
            <ApplicationFullView
              applicationData={appData}
              assessments={assessments}
            />
          </div>

          {/* EXPERT FEEDBACK PANEL */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white shadow-md sticky top-32">
              <CardHeader className="border-b border-green-100 pb-3">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Expert Endorsement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                    Validated By
                  </p>
                  <p className="font-bold text-gray-900 text-lg">
                    {expertReview?.expertName}
                  </p>
                  <p className="text-xs text-gray-400">{expertReview?.date}</p>
                </div>

                <div className="relative pl-6">
                  <Quote className="w-6 h-6 text-green-300 absolute -top-2 -left-2 transform -scale-x-100" />
                  <p className="text-gray-700 italic text-sm leading-relaxed border-l-4 border-green-300 pl-4 py-1">
                    {expertReview?.comments}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
