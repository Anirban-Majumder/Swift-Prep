// @ts-nocheck
"use client";
import { useState, useEffect, useContext, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import Navbar from "@/app/components/Navbar";
import { SessionContext } from "@/lib/supabase/usercontext";
import ReactMarkdown from 'react-markdown';

export default function TopicChatPage() {
  const { sessionData } = useContext(SessionContext);
  const profile = sessionData?.profile;
  const searchParams = useSearchParams();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // System prompt with profile context
  const systemMessage = `
  You're a friendly and expert tutor who explains concepts clearly and concisely.  
  Adapt your teaching based on:
  - Name: ${profile?.first_name || 'there'}
  - Learning style: ${profile?.learning_style || 'general'}
  - Tech proficiency: ${profile?.tech_proficiency || 'intermediate'}
  - Grade level: ${profile?.grade || 'high school'}

  Use simple, engaging language with clear examples. Address the user by name and check if they need clarification.  
  Keep it friendly and interactive. Do **not** use any external tools—just provide direct explanations.
`;


  // Copilot chat setup with system prompt
  const { visibleMessages, appendMessage, isLoading: isGenerating } = useCopilotChat({
    options: {
      systemMessage: new TextMessage({
        content: systemMessage,
        role: Role.System
      })
    }
  });

  // Get topics from URL or profile
  useEffect(() => {
    if (!profile) return;

    const urlTopics = searchParams.get('topics')?.split(',').filter(Boolean) || [];
    if (urlTopics.length > 0) {
      setSelectedTopics(urlTopics);
      setLoading(false);
    } else {
      const subjectCode = searchParams.get('code');
      const subjectDetails = profile.smt_details?.find((d: any) => d.code === subjectCode);
      setSelectedTopics(subjectDetails?.topics || []);
      setLoading(false);
    }
  }, [profile, searchParams]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    appendMessage(new TextMessage({ 
      content: inputMessage, 
      role: Role.User 
    }));
    setInputMessage('');
  }, [inputMessage, isGenerating, appendMessage]);

  // Handle Enter key (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (selectedTopics.length > 0 && !visibleMessages.length) {
      const initialPrompt = systemMessage+` Explain these topics in detail: ${selectedTopics.join(', ')}.`;
      
      // Use sendMessage directly if it exists
      if (typeof sendMessage === 'function') {
        sendMessage(initialPrompt, { displayInUI: false });
      } else {
        // Fallback: use system message which is often hidden by default
        appendMessage(new TextMessage({ 
          content: initialPrompt, 
          role: Role.System || 'system',  // Use System role if available
          metadata: { hidden: true }      // Add metadata to mark it as hidden
        }));
      }
    }
  }, [selectedTopics]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="p-4 text-center text-gray-600 dark:text-gray-300">
          Loading profile and topics...
        </div>
      </div>
    );
  }

  if (!selectedTopics.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="p-4 text-center text-red-500 dark:text-red-400">
          No topics selected or found in your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <main className="flex-1 flex flex-col p-4">
        <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">


          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {visibleMessages
                .filter(m => m.role !== Role.System) // Hide system messages
                .map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[85%] ${
                      message.role === Role.User
                        ? 'bg-blue-100 dark:bg-blue-900 ml-auto'
                        : 'bg-gray-100 dark:bg-gray-700 mr-auto'
                    }`}
                  >
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
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

            <form onSubmit={handleSubmit} className="border-t pt-4 dark:border-gray-700">
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question... (Shift+Enter for new line)"
                  rows={Math.min(inputMessage.split('\n').length, 4)}
                  className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="self-end h-[44px] px-4 py-2 bg-blue-500 text-white rounded-lg 
                    hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed 
                    transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}