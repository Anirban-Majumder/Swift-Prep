// app/(Protected)/Study/[topicTitle]/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import ReactMarkdown from "react-markdown";

export default function StudyPage() {
  const searchParams = useSearchParams();
  const topicTitle = searchParams.get("topicTitle"); // Get the topic title from the URL

  const { visibleMessages, appendMessage, isLoading: isGenerating } = useCopilotChat({
    options: {
      systemMessage: new TextMessage({
        content: `You're a friendly and expert tutor. Explain the topic "${topicTitle}" in detail.`,
        role: Role.System,
      }),
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Studying: {topicTitle}
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            {visibleMessages
              .filter((m) => m.role !== Role.System) // Hide system messages
              .map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === Role.User
                      ? "bg-blue-100 dark:bg-blue-900 ml-auto"
                      : "bg-gray-100 dark:bg-gray-700 mr-auto"
                  }`}
                >
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </p>
                </div>
              ))}

            {isGenerating && (
              <div className="flex justify-center">
                <div className="animate-pulse text-gray-500 dark:text-gray-400">
                  Generating response...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}