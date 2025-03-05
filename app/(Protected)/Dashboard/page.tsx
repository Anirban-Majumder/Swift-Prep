"use client";
import React, { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { SessionContext } from '@/lib/supabase/usercontext';
import { X, Upload, FileText, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  
  const { sessionData } = useContext(SessionContext);
  
  
  // File drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const processPdf = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    if (!sessionData.session?.user.id) {
      setError("You must be logged in to process a syllabus");
      return;
    }
  
    setError("");
    setIsProcessing(true);
    
    try {
      // Create form data to send to API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", sessionData.session.user.id);
      formData.append("fileName", fileName);
      
      // Send to our API endpoint
      const response = await fetch('/api/savesyllabus', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log("Response data:", data.data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to process PDF");
      }
      
      setSuccess("Syllabus uploaded and processed successfully!");
      setIsProcessing(false);
      
    } catch (err: any) {
      console.error("Error processing PDF:", err);
      setError(err.message || "Failed to process PDF");
      setIsProcessing(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setFileName("");
    setError("");
    setSuccess("");
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Course Syllabus</h2>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  type="button"
                  className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none"
                  onClick={() => setSuccess("")}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  type="button"
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                  onClick={() => setError("")}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="space-y-6">
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className={`w-12 h-12 ${isDragActive ? "text-blue-500" : "text-gray-400"}`} />
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop the PDF here" : "Drag & drop a PDF syllabus or click to browse"}
                </p>
                <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  title="Remove file"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={resetForm}
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            
            <button
              onClick={processPdf}
              disabled={isProcessing || !file}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                "Process Syllabus"
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Courses Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Courses</h2>
        <p className="text-gray-500">
          {sessionData.session ? 
            "Your recently processed syllabi will appear here." : 
            "Please sign in to view your courses."}
        </p>
      </div>
    </div>
  );
}