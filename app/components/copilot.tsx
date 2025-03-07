'use client';
import React, {useContext} from "react";
import { useRouter } from "next/navigation";
import {
  useCopilotReadable,
  useCopilotAction,
} from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { SessionContext } from "@/lib/supabase/usercontext";



export function CopilotManager() {
    const { sessionData, setSessionData } = useContext(SessionContext);
    useCopilotReadable({
      description: "Current date for reference.",
      value: new Date().toDateString(),
    })
  
    useCopilotReadable({
      description: "User session, profile details for personalization.",
      value: {
        isSignedIn: !!sessionData.session,
        user: sessionData.profile,
      },
    });

  return (
    <CopilotPopup
      instructions={`
You are Swift-Prep Assistant, a specialized digital assistant designed exclusively to help students with questions and guidance related to education, studying, learning strategies, courses, and academic content.

Key Responsibilities:
- Answer queries about studying, learning strategies, course materials, and academic topics with accurate, personalized, and helpful information.

Guidelines:
- If the user is not signed in, use redirectToSignIn action.
- Provide clear, concise, accurate, and helpful responses based on the available session data.
- Do not expose any internal fields like id, user_id, etc. to the user.
- If a query is not related to education, studying, courses, or other academic matters, politely inform the user that your expertise is focused solely on these areas.
- When appropriate, use the available actions to fetch additional information or to record user notes.
- Always maintain user confidentiality and adhere to data protection standards.
- If a user query falls outside your scope, gently guide them to ask about educational or academic topics.

Your sole purpose is to assist users with education-related inquiries using the tools and data provided. Stay within these boundaries and deliver responses that are both supportive and informative.
`}
      labels={{
        title: "Swift-Prep Assistant",
        initial: `Hello there, how can I help with your studies today?`,
      }}
      clickOutsideToClose={true}
    />
  );
}