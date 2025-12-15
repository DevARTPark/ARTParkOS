import React, { useState } from "react";
import { Brain } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import ChatWidget, { Message } from "../../../components/ui/ChatWidget";
import { suppliersApi, labsApi, mentorsApi } from "../../../api/portalApi";

export default function KnowledgeAIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm ARTPark Knowledge AI. I can help you find suppliers, test labs, facilities, and mentors. What are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response with RAG-like behavior
    // In a real app, this would call an LLM backend
    setTimeout(() => {
      const lowerContent = content.toLowerCase();
      let response = "";
      const links: Array<{ type: string; id: string; name: string }> = [];

      // Simple keyword matching logic
      if (
        lowerContent.includes("supplier") ||
        lowerContent.includes("component") ||
        lowerContent.includes("hardware")
      ) {
        response =
          "I found several suppliers that might match your requirements. Here are a few top-rated options:";
        suppliersApi.getAll().then((suppliers) => {
          suppliers.slice(0, 3).forEach((s) => {
            links.push({ type: "suppliers", id: s.id, name: s.name });
          });
        });
      } else if (
        lowerContent.includes("lab") ||
        lowerContent.includes("test") ||
        lowerContent.includes("testing")
      ) {
        response =
          "I can help you find test labs for your product validation. Here are some available facilities:";
        labsApi.getAll().then((labs) => {
          labs.slice(0, 2).forEach((l) => {
            links.push({ type: "labs", id: l.id, name: l.name });
          });
        });
      } else if (
        lowerContent.includes("mentor") ||
        lowerContent.includes("expert") ||
        lowerContent.includes("advice")
      ) {
        response =
          "Connecting with the right expert is crucial. Here are some mentors with relevant expertise:";
        mentorsApi.getAll().then((mentors) => {
          mentors.slice(0, 2).forEach((m) => {
            links.push({ type: "mentors", id: m.id, name: m.name });
          });
        });
      } else {
        response =
          "I can help you find resources within the ARTPark ecosystem. You can ask me about finding specific suppliers, booking test labs, or connecting with mentors.";
      }

      // Small delay to ensure promises resolve if any
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
          links: links.length > 0 ? links : undefined,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 500);
    }, 1000);
  };

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

        <div className="flex-1 min-h-0">
          <ChatWidget
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Ask about suppliers, labs, facilities, or mentors..."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
