import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);

const scheduleModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction: `You are an expert educational scheduler.
Your task is to generate an intelligent study schedule.
Given a list of module containg a list of topics and a base study time in hours, determine an appropriate study time for each module.
Each module is seprated by a "|" .
Ensure each key (corresponding to a topic index) has a study duration (in hours) in the format "Xhr".
Also, add a "review" key with a fixed time of "1hr".
Return only a valid JSON object.`
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: "application/json"
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topics, study_time } = body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: "Topics must be a non-empty array" },
        { status: 400 }
      );
    }

    if (typeof study_time !== 'number' || study_time <= 0) {
      return NextResponse.json(
        { error: "Study time must be a positive number" },
        { status: 400 }
      );
    }

    // Create a prompt instructing the AI to generate schedule intelligently
    const prompt = `Given the topics: ${topics.join('| ')}, and a base study time of ${study_time}hr, generate an intelligent study schedule.
Assign each topic (by its index order) a study duration in hours in the format "Xhr" and add a "review" session with exactly "1hr".
Return only the JSON object with the schedule.`;

    // Start a chat session using the scheduleModel
    const chatSession = scheduleModel.startChat({
      // @ts-ignore
      generationConfig,
      history: []
    });
    
    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();

    let schedule;
    try {
      schedule = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error("AI returned an invalid JSON response");
    }

    return NextResponse.json({ schedule });
  } catch (error: any) {
    console.error("Error generating schedule:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate schedule" },
      { status: 500 }
    );
  }
}