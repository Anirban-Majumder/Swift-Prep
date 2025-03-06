import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction: `You are an expert educational quiz generator.
Your task is to generate high-quality multiple-choice questions on specific topics and at the specified difficulty level.

Each question should:
1. Be clear and unambiguous
2. Have exactly 4 options (labeled a, b, c, d)
3. Have exactly one correct answer
4. Be appropriate for the specified difficulty level
5. Be directly relevant to the provided topics

OUTPUT FORMAT:
Return a valid JSON array with each object having the following structure:
[
  {
    "question": "The full question text?",
    "options": ["option a", "option b", "option c", "option d"],
    "correct": "option a" // The full text of the correct option
  }
]

DIFFICULTY LEVELS:
- easy: Basic recall and understanding questions
- medium: Application and analysis questions
- hard: Evaluation, synthesis and complex problem-solving questions

Make sure all questions are factually accurate and educationally sound.`
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4086,
  responseMimeType: "application/json"
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { no_of_questions, difficulty, topics } = body;
    
    if (!no_of_questions || !difficulty || !topics) {
      return NextResponse.json(
        { error: "Missing required fields: no_of_questions, difficulty, or topics" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (typeof no_of_questions !== 'number' || no_of_questions <= 0 || no_of_questions > 50) {
      return NextResponse.json(
        { error: "Number of questions must be between 1 and 50" },
        { status: 400 }
      );
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      return NextResponse.json(
        { error: "Difficulty must be 'easy', 'medium', or 'hard'" },
        { status: 400 }
      );
    }

    if (!Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: "Topics must be a non-empty array" },
        { status: 400 }
      );
    }

    // Start a chat session
    const chatSession = model.startChat({
      // @ts-ignore
      generationConfig,
      history: []
    });
    
    // Create prompt with the specific requirements
    const prompt = `Generate ${no_of_questions} ${difficulty} difficulty multiple-choice questions on the following topics: ${topics.join(', ')}.
    
Each question should have 4 options (a, b, c, d) with exactly one correct answer.
Ensure the questions are appropriate for the ${difficulty} difficulty level.
Return only the JSON array with the questions, options, and correct answers.`;
    
    // Send message to model
    const result = await chatSession.sendMessage(prompt);
    
    // Get the structured data from the response
    const responseText = await result.response.text();
    let quizData = JSON.parse(responseText);

    return NextResponse.json({
      data: quizData
    });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}