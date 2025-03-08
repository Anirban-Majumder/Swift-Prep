import React, { useState } from 'react';
import { ChevronRight, ChevronDown, ArrowRight, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Topic {
  topicTitle: string;
  duration: string;
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

interface RoadmapComponentProps {
  syllabusData: Module[];
}

const RoadmapComponent: React.FC<RoadmapComponentProps> = ({ syllabusData }) => {
  const router = useRouter();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const handleModuleClick = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setExpandedGroup(null);
  };

  const handleGroupClick = (groupId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const navigateToDetail = (type: string, id: string) => {
    router.push(`/learn/${type}/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Card className="max-w-4xl mx-auto bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            Course Roadmap
          </h1>

          <div className="space-y-8">
            {syllabusData.map((module, index) => (
              <div key={module.moduleId} className="relative group">
                {/* Animated Connector Line */}
                {index < syllabusData.length - 1 && (
                  <div className="absolute left-6 top-16 w-1 bg-gradient-to-b from-blue-500 to-blue-700 h-24 -z-10
                    group-hover:animate-pulse transition-all duration-300" />
                )}

                <Collapsible
                  open={expandedModule === module.moduleId}
                  onOpenChange={() => handleModuleClick(module.moduleId)}
                >
                  <CollapsibleTrigger asChild>
                    <Card className="w-full cursor-pointer border-gray-700 bg-gray-800
                      hover:bg-gray-750 transition-all duration-300 hover:shadow-xl
                      hover:shadow-blue-900/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700
                              flex items-center justify-center text-white font-bold shadow-lg
                              group-hover:scale-110 transition-transform duration-300">
                              {index + 1}
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-white group-hover:text-blue-400
                                transition-colors duration-300">
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

                  <CollapsibleContent className="mt-4 space-y-4" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}> {/* Added scrollable styles */}
                    {module.topicGroups.map((group) => (
                      <Collapsible
                        key={group.groupId}
                        open={expandedGroup === group.groupId}
                        onOpenChange={(open: any) => {
                          if (open) setExpandedGroup(group.groupId);
                          else setExpandedGroup(null);
                        }}
                      >
                        <Card className="bg-gray-750 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <CollapsibleTrigger className="w-full flex-1">
                                <div className="flex items-center justify-between cursor-pointer">
                                  <h3 className="text-lg font-medium text-white hover:text-blue-400
                                    transition-colors duration-300">
                                    {group.groupTitle}
                                  </h3>
                                  {expandedGroup === group.groupId ? (
                                    <ChevronDown className="w-5 h-5 text-blue-500" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-blue-500" />
                                  )}
                                </div>
                              </CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent collapsing when clicking "Learn More"
                                  navigateToDetail('group', group.groupId);
                                }}
                              >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>

                            <CollapsibleContent className="mt-4 space-y-3" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}> {/* Added scrollable styles for topic groups */}
                              {group.topics.map((topic, topicIndex) => (
                                <Card key={topicIndex} className="bg-gray-700 border-gray-600">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-200">{topic.topicTitle}</span>
                                      <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-gray-400">
                                          {topic.duration}
                                        </Badge>
                                     
                                      </div>
                                    </div>
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
    </div>
  );
};

export default RoadmapComponent;