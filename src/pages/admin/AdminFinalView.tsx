import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Quote,
  Loader2,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react";
import { API_URL } from "../../config";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import ApplicationFullView from "../../components/common/ApplicationFullView";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

export default function AdminFinalView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH FULL CONTEXT ---
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await fetch(
          `${API_URL}/api/admin/application-context/${id}`,
        );
        if (res.ok) {
          setData(await res.json());
        } else {
          console.error("Failed to load context");
        }
      } catch (error) {
        console.error("Network error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading)
    return (
      <DashboardLayout role="admin">
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  if (!data)
    return (
      <DashboardLayout role="admin">
        <div className="p-12 text-center">Data not found</div>
      </DashboardLayout>
    );

  const { application, assessments, expertReviews } = data; // <--- Destructure Array

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
        {/* HEADER */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Application
                Details
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Review application and expert feedback for the offline pitch
                round.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN VIEW */}
          <div className="lg:col-span-2">
            <ApplicationFullView
              applicationData={application}
              assessments={assessments}
            />
          </div>

          {/* EXPERT FEEDBACK PANEL (Loop through all reviews) */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5" /> Expert Reviews (
              {expertReviews?.length || 0})
            </h3>

            {expertReviews && expertReviews.length > 0 ? (
              expertReviews.map((review: any, index: number) => (
                <Card
                  key={index}
                  className={`border-2 shadow-sm ${
                    review.decision === "APPROVED"
                      ? "border-green-200 bg-green-50/30"
                      : "border-red-200 bg-red-50/30"
                  }`}
                >
                  <CardHeader className="border-b border-gray-100 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {review.decision === "APPROVED" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      Verdict: {review.decision}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                        Validated By
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {review.expertName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(
                          review.respondedAt || Date.now(),
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="relative pl-6">
                      <Quote className="w-6 h-6 text-gray-300 absolute -top-2 -left-2 transform -scale-x-100" />
                      <p className="text-gray-800 italic text-sm leading-relaxed border-l-4 border-gray-300 pl-4 py-1 whitespace-pre-wrap break-words">
                        {review.comments}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  No expert reviews found.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
