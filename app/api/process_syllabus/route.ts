import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import os from "os";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction: `You are an expert syllabus analyzer that extracts structured information from OCR text.
Your task is to parse educational syllabi and organize the content into a standardized JSON format with subjects, their codes, types, Units, and topics.

OUTPUT FORMAT:
{
  "subjects": [
    {
      "subject": "Subject Name",
      "code": "Subject Code",
      "type": "theory|practical"
    }
    // Additional subjects as needed
  ],
  "smt_details": [
    {
      "code": "Subject Code",
      "topics": ["Topics from unit 1", "Topics from unit 2", "Topics from unit 3"]
    }
    // Additional subjects with their topics
  ]
}

EXTRACTION RULES:
1. For the "subjects" array:
   - Extract the full subject name as "subject"
   - Extract the alphanumeric code as "code"
   - Determine if it's "theory" or "practical" as "type"
2. For the "smt_details" array:
   - Create an object for each subject containing:
     - The subject code as "code" (matching "code" from subjects array)
     - An array of topics as "topics"
3. If the syllabus is incomplete or unclear:
   - Extract whatever information is available
   - Use empty arrays for missing topics
   - Return an empty object {} only if no valid data can be extracted at all

EXAMPLE INPUT:
"CS101 Introduction to Programming (Theory)
Unit 1: Programming Basics
- Variables and Data Types
- Control Structures
- Functions

Unit 2: Programming Basics
- Arrays and Strings
- Pointers and Memory Management
- Classes and Objects


CS102 Programming Lab (Practical)
Unit 1: Basic Programming Exercises
- Implementation of sorting algorithms
- Simple console applications"

EXAMPLE OUTPUT:
{
  "subjects": [
    {
      "subject": "Introduction to Programming",
      "code": "CS101",
      "type": "theory"
    },
    {
      "subject": "Programming Lab",
      "code": "CS102",
      "type": "practical"
    }
  ],
  "smt_details": [
    {
      "code": "CS101",
      "topics": ["Variables and Data Types, Control Structures, Functions" , "Arrays and Strings, Pointers and Memory Management, Classes and Objects"]
    },
    {
      "code": "CS102",
      "topics": ["Implementation of sorting algorithms", "Simple console applications"]
    }
  ]
}

IMPORTANT:
- Produce clean, valid JSON with no formatting or newlines in the output
- Include only the fields specified in this schema
- Use consistent naming across the structure
- Infer missing information where possible based on context`,
});

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      subjects: {
        type: "array",
        items: {
          type: "object",
          properties: {
            subject: {
              type: "string",
            },
            code: {
              type: "string",
            },
            type: {
              type: "string",
            },
          },
          required: ["subject", "code", "type"],
        },
      },
      smt_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            code: {
              type: "string",
            },
            topics: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["code", "topics"],
        },
      },
    },
    required: ["subjects", "smt_details"],
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const fileName = formData.get("fileName") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get buffer from file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a temporary file
    const tempFilePath = path.join(os.tmpdir(), file.name);
    await fs.promises.writeFile(tempFilePath, buffer);

    // Upload to Gemini using the file path
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: file.type,
      displayName: file.name,
    });

    // Clean up the temporary file
    await fs.promises.unlink(tempFilePath);

    const uploadedFile = uploadResult.file;

    // Wait for file processing
    console.log("Waiting for file processing...");
    let processedFile = await fileManager.getFile(uploadedFile.name);
    while (processedFile.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      processedFile = await fileManager.getFile(uploadedFile.name);
    }

    if (processedFile.state !== "ACTIVE") {
      throw Error(`File processing failed`);
    }

    //ts ignore
    const chatSession = model.startChat({
      // @ts-ignore
      generationConfig,
      history: [],
    });

    // Send message to model
    const result = await chatSession.sendMessage([
      {
        fileData: {
          mimeType: processedFile.mimeType,
          fileUri: processedFile.uri,
        },
      },
      { text: "Extract the syllabus information from this document" },
    ]);

    // Get the structured data from the response
    const responseText = await result.response.text();
    const syllabusData = JSON.parse(responseText);
    console.log("Syllabus data:", syllabusData);

    return NextResponse.json({
      data: syllabusData,
    });
  } catch (error: any) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process syllabus" },
      { status: 500 }
    );
  }
}
