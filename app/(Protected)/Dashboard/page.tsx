"use client";
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { SessionContext } from '@/lib/supabase/usercontext';
import { X, Upload, FileText, Loader2, BookmarkPlus, Filter, Eye, Clock, Star } from 'lucide-react';
import { Profile } from '@/lib/db_types';
import Footer from "../../landing/footer/page";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Dashboard() {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { sessionData, setSessionData } = useContext(SessionContext);

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
    accept: { 'application/pdf': ['.pdf'] },
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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", sessionData.session.user.id);
      formData.append("fileName", fileName);
      const response = await fetch('/api/process_syllabus', { method: 'POST', body: formData });
      const data = await response.json();
      
      const existingSubjects = sessionData.profile?.subjects || [];
      const existingSmtDetails = sessionData.profile?.smt_details || [];
      const existingCodes = new Set(existingSubjects.map((s: any) => s.code));
      const newSubjects = data.data.subjects.filter((s: any) => !existingCodes.has(s.code));
      const existingSmtCodes = new Set(existingSmtDetails.map((s: any) => s.code));
      const newSmtDetails = data.data.smt_details.filter((s: any) => !existingSmtCodes.has(s.code));
      
      const mergedSubjects = [...existingSubjects, ...newSubjects];
      const mergedSmtDetails = [...existingSmtDetails, ...newSmtDetails];
      
      setSessionData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          subjects: mergedSubjects,
          smt_details: mergedSmtDetails,
        } as Profile
      }));

      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process PDF");
      }
      setSuccess("Syllabus uploaded and processed successfully!");

      const { error: supabaseError } = await supabase
        .from('profiles_swiftprep')
        .update({
          subjects: mergedSubjects,
          smt_details: mergedSmtDetails
        })
        .eq('user_id', sessionData.session.user.id);
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process PDF");
    }
    setIsProcessing(false);
  };

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setError("");
    setSuccess("");
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[#0F172A] text-white relative">
      <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
      <div {...getRootProps()} className="border-2 border-dashed p-6 text-center cursor-pointer border-gray-600 bg-[#1E293B] text-gray-300">
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the PDF file here...</p> : <p>Drag & drop a PDF here, or click to select one</p>}
        <p className="text-sm text-gray-500">(Maximum file size: 10MB)</p>
        {fileName && <p className="mt-2 text-sm text-gray-400">Selected file: {fileName}</p>}
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex-1">
          {error && <p className="text-red-500 text-m">{error}</p>}
          {success && <p className="text-green-500 text-m">{success}</p>}
        </div>
        <div className="flex space-x-3">
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
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            Process PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6 mb-6">
        {sessionData.profile?.subjects &&
          sessionData.profile.subjects.map((subjectItem: any, index: number) => {
            // Find matching smt_details entry for this subject
            const smtDetail = sessionData.profile?.smt_details?.find(
              (detail: any) => detail.code === subjectItem.code
            );

            return (
              <Card key={index} className="bg-[#1E293B] text-white rounded-lg p-4 shadow-lg h-full">
                <CardContent className="h-full flex flex-col justify-between p-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{subjectItem.subject} ({subjectItem.code})</h3>
                    <p className="text-sm text-gray-400 mb-1">Type: {subjectItem.type}</p>
                    <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                      <Clock size={16} /> {Math.floor(Math.random() * 10) + 5} min •
                      <Eye size={16} /> {Math.floor(Math.random() * 2000) + 500} views •
                      <Star size={16} /> {(Math.random() * (5 - 4) + 4).toFixed(1)}/5
                    </p>
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <Button size="sm" className="flex-1 bg-green-500 text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm">Start Studying</Button>
                    <Button size="sm" className="flex-1 bg-yellow-500 text-white hover:bg-yellow-700 px-3 py-2 rounded-md text-sm">Start Quiz</Button>
                    <Button size="sm" className="flex-1 bg-purple-500 text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm">Make Notes</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
      <Footer />
    </div>
  );
}
