import React from "react";
import { Brain } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
// ✅ FIX 1: Use Named Import
import { ChatWidget } from "../../../components/ui/ChatWidget";

export default function KnowledgeAIAssistantPage() {
  // We don't need local state anymore because ChatWidget manages its own connection to the backend.

  return (
    <DashboardLayout role="founder" title="AI Assistant">
      <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ARTPark Knowledge AI
              </h1>
              <p className="text-gray-600 text-sm">
                Your intelligent assistant for finding resources and answers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-gray-50 rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            AI Assistant is Active
          </h2>
          <p className="text-gray-500 max-w-md mt-2">
            The ARTPark Intelligence is now available globally on your
            dashboard.
            <br />
            <strong>Click the blue chat button</strong> in the bottom right
            corner of your screen to start searching for startups, labs, or
            mentors!
          </p>
        </div>

        {/* ✅ FIX 2: Render the self-contained widget */}
        {/* <ChatWidget /> */}
      </div>
    </DashboardLayout>
  );
}
