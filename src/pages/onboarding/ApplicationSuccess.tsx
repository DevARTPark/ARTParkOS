import React from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ApplicationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user ID from state (passed from ApplicationEngine) or fallback to local storage
  const userId =
    location.state?.userId ||
    JSON.parse(localStorage.getItem("artpark_user") || "{}").id;

  const handleStartAssessment = () => {
    if (userId) {
      navigate(`/assessment/${userId}`);
    } else {
      // Fallback if ID is missing (should rarely happen)
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Application Received!
        </h1>
        <p className="text-gray-600 mb-8">
          We have successfully received your initial submission.
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-start gap-4 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Action Required</h3>
              <p className="text-sm text-blue-800 mt-1">
                We have sent an email to{" "}
                <strong>you and all co-founders</strong>.
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-4 pl-12 leading-relaxed">
            Please proceed immediately to the{" "}
            <strong>Innovation Index Assessment</strong>.
            <br />
            <br />
            <span className="font-semibold">Note:</span> Your application is not
            complete until ALL team members submit this assessment.
          </p>
        </div>

        {/* Updated Button to go to Assessment */}
        <button
          onClick={handleStartAssessment}
          className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-md shadow-indigo-200"
        >
          Start Your Assessment <ArrowRight className="w-4 h-4" />
        </button>

        {/* Optional secondary link to go home if needed */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
