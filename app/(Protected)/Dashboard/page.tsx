"use client";
import React, { useState, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { SessionContext } from "@/lib/supabase/usercontext";
import {
  X,
  Upload,
  FileText,
  Loader2,
  Eye,
  Clock,
  Star,
  Search,
  User,
  Home,
  BookOpen,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { Profile } from "@/lib/db_types";
import Footer from "../../landing/footer/page";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const { sessionData, setSessionData } = useContext(SessionContext);
  const router = useRouter();

  // Filter subjects based on search query
  const filteredSubjects = sessionData.profile?.subjects?.filter((subject) =>
    subject.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
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
      const response = await fetch("/api/process_syllabus", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      const existingSubjects = sessionData.profile?.subjects || [];
      const existingSmtDetails = sessionData.profile?.smt_details || [];
      const existingCodes = new Set(existingSubjects.map((s: any) => s.code));
      const newSubjects = data.data.subjects.filter(
        (s: any) => !existingCodes.has(s.code)
      );
      const existingSmtCodes = new Set(
        existingSmtDetails.map((s: any) => s.code)
      );
      const newSmtDetails = data.data.smt_details.filter(
        (s: any) => !existingSmtCodes.has(s.code)
      );

      const mergedSubjects = [...existingSubjects, ...newSubjects];
      const mergedSmtDetails = [...existingSmtDetails, ...newSmtDetails];

      setSessionData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          subjects: mergedSubjects,
          smt_details: mergedSmtDetails,
        } as Profile,
      }));

      if (!response.ok) {
        throw new Error(data.error || "Failed to process PDF");
      }
      setSuccess("Syllabus uploaded and processed successfully!");

      const { error: supabaseError } = await supabase
        .from("profiles_swiftprep")
        .update({
          subjects: mergedSubjects,
          smt_details: mergedSmtDetails,
        })
        .eq("user_id", sessionData.session.user.id);

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

  const startQuiz = (subject: string) => {
    router.push(`/Quiz?subject=${encodeURIComponent(subject)}`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const FullPageLoader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin text-white mb-4" size={48} />
        <p className="text-white text-lg font-semibold">Processing PDF...</p>
      </div>
    </div>
  );

  return (
    <div
      className={`flex flex-col min-h-screen font-sans ${
        isDarkMode
          ? "bg-gradient-to-br from-[#030616] via-[#0A1F38] to-[#071A2F] text-white"
          : "bg-gradient-to-br from-[#f8fafc] via-[#668bf2] to-[#f8fafc] text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 p-4 fixed h-full ${
          isDarkMode
            ? "bg-[#1E293B]/90 backdrop-blur-md text-white border-r border-[#334155]/50"
            : "bg-white/90 backdrop-blur-md text-gray-900 border-r border-gray-200"
        }`}
      >
        <div className="flex items-center mb-8">
          <BookOpen
            className={`${isDarkMode ? "text-blue-500" : "text-blue-600"} mr-2`}
            size={24}
          />
          <h1 className="text-xl font-bold">SwiftPrep</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className={`flex items-center p-2 ${
                  isDarkMode
                    ? "hover:bg-[#334155]/50 text-white"
                    : "hover:bg-gray-100/50 text-gray-900"
                } rounded transition-all`}
              >
                <Home className="mr-2" size={18} />
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`flex items-center p-2 ${
                  isDarkMode
                    ? "hover:bg-[#334155]/50 text-white"
                    : "hover:bg-gray-100/50 text-gray-900"
                } rounded transition-all`}
              >
                <BookOpen className="mr-2" size={18} />
                Courses
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`flex items-center p-2 ${
                  isDarkMode
                    ? "hover:bg-[#334155]/50 text-white"
                    : "hover:bg-gray-100/50 text-gray-900"
                } rounded transition-all`}
              >
                <Settings className="mr-2" size={18} />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {isProcessing && <FullPageLoader />}
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${
                  isDarkMode
                    ? "bg-[#1E293B]/50 text-white"
                    : "bg-white/90 text-gray-900"
                } rounded-full pl-10 pr-4 py-2 focus:outline-none backdrop-blur-md border ${
                  isDarkMode ? "border-gray-600/50" : "border-gray-200"
                }`}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-[#334155]/50" : "bg-gray-100/50"
              } backdrop-blur-md transition-all hover:scale-110`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <User className="text-gray-400" size={24} />
              <span
                className={`${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {sessionData.profile?.username}
              </span>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 text-center cursor-pointer ${
            isDarkMode
              ? "border-gray-600/50 bg-[#1E293B]/50 text-white"
              : "border-gray-300 bg-white/90 text-gray-900"
          } rounded-lg backdrop-blur-md transition-all hover:scale-105`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the PDF file here...</p>
          ) : (
            <p>Drag & drop a PDF here, or click to select one</p>
          )}
          <p className="text-sm text-gray-500">(Maximum file size: 10MB)</p>
          {fileName && (
            <p className="mt-2 text-sm text-gray-400">
              Selected file: {fileName}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex-1">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={resetForm}
              type="button"
              className={`px-4 py-2 border ${
                isDarkMode ? "border-gray-600/50" : "border-gray-300"
              } rounded-md shadow-sm text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-700"
              } hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Reset
            </button>

            <button
              onClick={processPdf}
              disabled={isProcessing || !file}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                isDarkMode ? "text-white" : "text-white"
              } bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Process PDF
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6 mb-6">
          {filteredSubjects?.length ? (
            filteredSubjects.map((subjectItem: any, index: number) => {
              const smtDetail = sessionData.profile?.smt_details?.find(
                (detail: any) => detail.code === subjectItem.code
              );

              return (
                <Card
                  key={index}
                  className={`${
                    isDarkMode
                      ? "bg-[#1E293B]/50 backdrop-blur-md border border-[#334155]/50"
                      : "bg-white/90 backdrop-blur-md border border-gray-200"
                  } rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="h-full flex flex-col justify-between p-0">
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {subjectItem.subject} ({subjectItem.code})
                      </h3>
                      <p className="text-sm text-gray-400 mb-1">
                        Type: {subjectItem.type}
                      </p>
                      <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                        <Clock size={16} /> {Math.floor(Math.random() * 10) + 5}{" "}
                        min •
                        <Eye size={16} />{" "}
                        {Math.floor(Math.random() * 2000) + 500} views •
                        <Star size={16} />{" "}
                        {(Math.random() * (5 - 4) + 4).toFixed(1)}/5
                      </p>
                    </div>
                    <div className="flex gap-3 mt-auto">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 px-3 py-2 rounded-md text-sm"
                      >
                        Start Studying
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => startQuiz(subjectItem.subject)}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 px-3 py-2 rounded-md text-sm"
                      >
                        Start Quiz
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-3 py-2 rounded-md text-sm"
                      >
                        Make Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No subjects found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer className="mt-auto" />
    </div>
  );
}
