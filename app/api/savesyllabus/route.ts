import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { createClient } from '@/lib/supabase/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

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

    // Create model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      systemInstruction: "When processing OCR text from a syllabus, extract and structure the data into a valid JSON object with the following format:{\"subjects\": [{\"s\": \"<subject name>\", \"c\": \"<subject code>\",\"t\": \"<subject type (theory or practical)>\"}// ... additional subject objects  ],  \"smt_details\": {    \"<subject name>\": [      {\"<module name>\": [\"<topic1>\", \"<topic2>\" /*, ... additional topics as extracted*/]      }      // ... additional module objects for this subject    ]    // ... additional subjects with their corresponding modules  }}Instructions:1. Subjects Array:   - Each element in the \"subjects\" array must be an object containing:     - \"s\": The subject name.     - \"c\": The subject code.     - \"t\": The subject type (either \"theory\" or \"practical\").2. smt_details Object:   - Use the subject name (matching the value of \"s\") as the key.   - The value for each key is an array of module objects for that subject.   - Each module object should include:     - \"m\": The module name.     - \"t\": An array of topics extracted from the OCR text for that module.3. Output Requirements:    - Dont format or give newlines in the output. - The final output must be a valid JSON object.   - Include only the fields specified in this schema.   - Accurately extract and map module names and their corresponding topics under the appropriate subjects.   - If no valid data can be extracted, return an empty object: {}.",
    });

    // Send the file to the model
    const generationConfig = {
      temperature: 0,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    // Send message to model
    const result = await chatSession.sendMessage([
      {
        fileData: {
          mimeType: processedFile.mimeType,
          fileUri: processedFile.uri,
        }
      },
      {text: "Extract the syllabus information from this document"}
    ]);
    
    // Get the structured data from the response
    const syllabusData = result.response.text().replace("", "");  
    
    // Save to Supabase
    //const supabase = createClient();
    //const { data, error: supabaseError } = await supabase
    //  .from('syllabi')
    //  .insert({
    //    user_id: userId,
    //    file_name: fileName,
    //    content: syllabusData,
    //    created_at: new Date().toISOString()
    //  })
    //  .select();
    //
    //if (supabaseError) {
    //  throw new Error(supabaseError.message);
    //}
    
    return NextResponse.json({
      success: true,
      message: "Syllabus processed successfully",
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