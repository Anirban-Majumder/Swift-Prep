"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Loader2,
  ArrowLeft,
  Check,
  Link,
  FileText,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Label } from "../../components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { SessionContext } from "@/lib/supabase/usercontext";

interface Topic {
  topicTitle: string;
  priority?: "High" | "Medium" | "Low";
  resources?: { type: "video" | "article"; link: string }[];
  notes?: string;
  completed?: boolean;
  allocatedTime?: string; // Allocated time in minutes
}

interface TopicGroup {
  groupTitle: string;
  groupId: string;
  topics: Topic[];
}

interface Module {
  moduleId: string;
  moduleTitle: string;
  lectureCount: number;
  topicGroups: TopicGroup[];
}

const RoadmapPage = () => {
  const router = useRouter();
  const { sessionData } = useContext(SessionContext);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [subject, setSubject] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [totalStudyTimeHours, setTotalStudyTimeHours] = useState<number | null>(
    null
  ); // Total study time in hours
  const [roadmapData, setRoadmapData] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const handleGenerateRoadmap = async () => {
    if (!subject.trim() || !syllabus.trim()) {
      setError("Please enter both subject and syllabus.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, syllabus }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap.");
      }

      const data = await response.json();
      setRoadmapData(data.modules);
    } catch (err) {
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to allocate study time to topics
  const allocateStudyTime = () => {
    if (!totalStudyTimeHours || !roadmapData.length) return;

    // Convert total study time from hours to minutes
    const totalStudyTimeMinutes = totalStudyTimeHours * 60;

    const totalTopics = roadmapData.reduce(
      (acc, module) =>
        acc +
        module.topicGroups.reduce((acc, group) => acc + group.topics.length, 0),
      0
    );

    const timePerTopic = totalStudyTimeMinutes / totalTopics;

    const updatedRoadmapData = roadmapData.map((module) => ({
      ...module,
      topicGroups: module.topicGroups.map((group) => ({
        ...group,
        topics: group.topics.map((topic) => ({
          ...topic,
          allocatedTime: `${Math.round(timePerTopic)} minutes`, // Allocate time equally
        })),
      })),
    }));

    setRoadmapData(updatedRoadmapData);
  };

  useEffect(() => {
    if (totalStudyTimeHours && roadmapData.length) {
      allocateStudyTime();
    }
  }, [totalStudyTimeHours, roadmapData]);

  const handleModuleClick = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setExpandedGroup(null);
  };

  const handleGroupClick = (groupId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const navigateToDetail = (topicTitle: string) => {
    router.push(`/study/${encodeURIComponent(topicTitle)}`);
  };

  const hasFetched = useRef(false); // Add a ref to track fetch status

  useEffect(() => {
    if (hasFetched.current || !sessionData?.profile) return;

    const relevantSmtDetail = sessionData.profile.smt_details?.find(
      (detail) => detail.code === code
    );
    const subjectDetail = sessionData.profile.subjects?.find(
      (sub) => sub.code === code
    );

    if (relevantSmtDetail?.topics?.length) {
      setSyllabus(relevantSmtDetail.topics.join(", ")); // Convert topics array to string
    }

    if (subjectDetail?.name) {
      setSubject(subjectDetail.name);
    }

    if (relevantSmtDetail?.topics?.length || subjectDetail?.name) {
      hasFetched.current = true; // Move this line here to prevent re-fetching
      handleGenerateRoadmap();
    }
  }, [sessionData, code]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Go Back Button */}
      <div className="max-w-4xl mx-auto p-8">
        <Button
          variant="ghost"
          className="mb-4 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
          onClick={() => router.push("/classroom")} // Redirect to /classroom
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back to Classroom
        </Button>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-500" />
          Course Roadmap Generator
        </h1>

        {/* Input Form */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject name"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Syllabus</Label>
              <Textarea
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                placeholder="Enter syllabus content"
                className="bg-gray-700 border-gray-600 text-white min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Total Study Time (hours)</Label>
              <Input
                type="number"
                value={totalStudyTimeHours || ""}
                onChange={(e) => setTotalStudyTimeHours(Number(e.target.value))}
                placeholder="Enter total study time in hours"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900 border-red-800"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGenerateRoadmap}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Roadmap...
                </>
              ) : (
                "Generate Roadmap"
              )}
            </Button>
          </CardContent>
        </Card>

        {roadmapData.length > 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-8">
                {roadmapData.map((module, index) => (
                  <div key={module.moduleId} className="relative group">
                    {/* Animated Connector Line */}
                    {index < roadmapData.length - 1 && (
                      <div
                        className="absolute left-6 top-16 w-1 bg-gradient-to-b from-blue-500 to-blue-700 h-24 -z-10
                        group-hover:animate-pulse transition-all duration-300"
                      />
                    )}

                    <Collapsible
                      open={expandedModule === module.moduleId}
                      onOpenChange={() => handleModuleClick(module.moduleId)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card
                          className="w-full cursor-pointer border-gray-700 bg-gray-750
                          hover:bg-gray-700 transition-all duration-300 hover:shadow-xl
                          hover:shadow-blue-900/20"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div
                                  className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700
                                  flex items-center justify-center text-white font-bold shadow-lg
                                  group-hover:scale-110 transition-transform duration-300"
                                >
                                  {index + 1}
                                </div>
                                <div>
                                  <h2
                                    className="text-xl font-semibold text-white group-hover:text-blue-400
                                    transition-colors duration-300"
                                  >
                                    {module.moduleTitle}
                                  </h2>
                                  <Badge variant="secondary" className="mt-1">
                                    {module.lectureCount} lectures
                                  </Badge>
                                </div>
                              </div>
                              {expandedModule === module.moduleId ? (
                                <ChevronDown className="w-6 h-6 text-blue-500" />
                              ) : (
                                <ChevronRight className="w-6 h-6 text-blue-500" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4 space-y-4">
                        {module.topicGroups.map((group) => (
                          <Collapsible
                            key={group.groupId}
                            open={expandedGroup === group.groupId}
                            onOpenChange={(open) => {
                              if (open) setExpandedGroup(group.groupId);
                              else setExpandedGroup(null);
                            }}
                          >
                            <Card className="bg-gray-700 border-gray-600">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <CollapsibleTrigger className="w-full flex-1">
                                    <div className="flex items-center justify-between cursor-pointer">
                                      <h3
                                        className="text-lg font-medium text-white hover:text-blue-400
                                        transition-colors duration-300"
                                      >
                                        {group.groupTitle}
                                      </h3>
                                      {expandedGroup === group.groupId ? (
                                        <ChevronDown className="w-5 h-5 text-blue-500" />
                                      ) : (
                                        <ChevronRight className="w-5 h-5 text-blue-500" />
                                      )}
                                    </div>
                                  </CollapsibleTrigger>
                                </div>

                                <CollapsibleContent className="mt-4 space-y-3">
                                  {group.topics.map((topic, topicIndex) => (
                                    <Card
                                      key={topicIndex}
                                      className="bg-gray-600 border-gray-500"
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-200">
                                            {topic.topicTitle}
                                          </span>
                                          <div className="flex items-center gap-3">
                                            {topic.priority && (
                                              <Badge
                                                variant={
                                                  topic.priority === "High"
                                                    ? "destructive"
                                                    : topic.priority ===
                                                      "Medium"
                                                    ? "warning"
                                                    : "default"
                                                }
                                              >
                                                {topic.priority}
                                              </Badge>
                                            )}
                                            {topic.allocatedTime && (
                                              <Badge
                                                variant="outline"
                                                className="text-gray-400"
                                              >
                                                {topic.allocatedTime}
                                              </Badge>
                                            )}
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                              onClick={() => {
                                                // Handle marking as completed
                                                const updatedRoadmapData = [
                                                  ...roadmapData,
                                                ];
                                                updatedRoadmapData[
                                                  index
                                                ].topicGroups.forEach((g) => {
                                                  g.topics.forEach((t) => {
                                                    if (
                                                      t.topicTitle ===
                                                      topic.topicTitle
                                                    ) {
                                                      t.completed =
                                                        !t.completed;
                                                    }
                                                  });
                                                });
                                                setRoadmapData(
                                                  updatedRoadmapData
                                                );
                                              }}
                                            >
                                              {topic.completed ? (
                                                <Check className="w-4 h-4" />
                                              ) : (
                                                <FileText className="w-4 h-4" />
                                              )}
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                navigateToDetail(
                                                  topic.topicTitle
                                                ); // Pass topic.topicTitle
                                              }}
                                            >
                                              Learn More
                                              <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                          </div>
                                        </div>
                                        {topic.resources && (
                                          <div className="mt-2 space-y-2">
                                            {topic.resources.map(
                                              (resource, idx) => (
                                                <a
                                                  key={idx}
                                                  href={resource.link}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex items-center text-blue-400 hover:text-blue-300"
                                                >
                                                  <Link className="w-4 h-4 mr-2" />
                                                  {resource.type === "video"
                                                    ? "Watch Video"
                                                    : "Read Article"}
                                                </a>
                                              )
                                            )}
                                          </div>
                                        )}
                                        {topic.notes && (
                                          <div className="mt-2 text-gray-300">
                                            <strong>Notes:</strong>{" "}
                                            {topic.notes}
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </CollapsibleContent>
                              </CardContent>
                            </Card>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center text-gray-400">
              No roadmap data available. Enter a subject and syllabus to
              generate a roadmap.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
