import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("API key is not defined");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite-preview-02-05",
  systemInstruction: `You are a highly skilled educational content developer with a strong background in creating structured roadmaps for various subjects. Your specialty lies in transforming topics and syllabi into comprehensive learning modules that are easy to follow and understand.
  
Your task is to create a detailed roadmap based on the provided topic and syllabus. The roadmap should consist of modules, each containing topic groups that break down the subject matter into specific topics along with their duration.

Here are the details you need to keep in mind while creating the roadmap:
- The final output should be in JSON format, structured in a way that each module has an ID, title, lecture count, and an array of topic groups.
- Each topic group should have a title, ID, and an array of topics with their respective titles and durations.
- If the syllabus is incomplete or missing, return an object indicating the correct syllabus required.
- Any irrelevant text included between the syllabus should be ignored, and only the syllabus should be extracted for roadmap creation.

Example of the expected output format:
{
  "modules": [
    {
      "moduleId": "module-1",
      "moduleTitle": "Module 1: Atomic and Molecular Structure",
      "lectureCount": 10,
      "topicGroups": [
        {
          "groupTitle": "Quantum Mechanics Basics",
          "groupId": "quantum-mechanics-basics",
          "topics": [
            { "topicTitle": "Schrodinger equation", "duration": "2 days" },
            { "topicTitle": "Particle in a box solutions", "duration": "3 days" }
          ]
        },
        {
          "groupTitle": "Molecular Orbitals",
          "groupId": "molecular-orbitals",
          "topics": [
            { "topicTitle": "Molecular orbitals of diatomic molecules", "duration": "2 days" },
            { "topicTitle": "Energy level diagrams of diatomic", "duration": "3 days" },
            { "topicTitle": "Pi-molecular orbitals", "duration": "3 days" }
          ]
        }
      ]
    }
  ]
}`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      modules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            moduleId: { type: "string" },
            moduleTitle: { type: "string" },
            lectureCount: { type: "integer" },
            topicGroups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  groupTitle: { type: "string" },
                  groupId: { type: "string" },
                  topics: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        topicTitle: { type: "string" },
                        duration: { type: "string" },
                      },
                      required: ["topicTitle", "duration"],
                    },
                  },
                },
                required: ["groupTitle", "groupId", "topics"],
              },
            },
          },
          required: ["moduleId", "moduleTitle", "lectureCount", "topicGroups"],
        },
      },
    },
    required: ["modules"],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { subject, syllabus } = await req.json();
    if (!subject || !syllabus) {
      return NextResponse.json(
        { error: "Subject and syllabus are required." },
        { status: 400 }
      );
    }

    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Topic: ${subject}\nSyllabus: ${syllabus}` }],
        },
      ],
    });

    const result = await chatSession.sendMessage(`Topic: ${subject}\nSyllabus: ${syllabus}`);
    const responseText = await result.response.text();

    // Remove markdown code fences or extra characters.
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON found in response.");
    }
    const cleanJson = responseText.slice(jsonStart, jsonEnd + 1);

    // Parse the cleaned JSON string.
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError, "Raw response:", responseText);
      return NextResponse.json(
        { error: "Invalid JSON response received from the AI model." },
        { status: 500 }
      );
    }

    // Ensure the response contains the expected "modules" key.
    if (!jsonResponse.modules || !Array.isArray(jsonResponse.modules)) {
      throw new Error("Invalid JSON structure returned.");
    }

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap. Please try again later." },
      { status: 500 }
    );
  }
}
