import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowLeft, PlusCircle, Loader2, Star, Trash2, MoreVertical, Search } from "lucide-react";

interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: string;
  totalCards: number;
  isCustom: boolean;
  isFavorited: boolean;
  creatorId?: string;
  learnedCount: number;
  progress: number;
}

interface UserProfile {
  uid: string;
  learnedWords: Array<{ topicId: string }>;
  level: { hierarchy: string };
}

interface TopicsPageProps {
  userProfile: UserProfile | null;
  onTopicSelect: (topic: Topic) => void;
  onBack: () => void;
  onNavigate: (screen: string) => void;
  topics: any[];
  onDeleteTopic: (topic: Topic) => Promise<void>;
}

const TOPICS_PER_PAGE = 19;

export function FlashcardTopicsPage({ 
  userProfile, onTopicSelect, onBack, onNavigate
}: TopicsPageProps) {
  
  const [topics, setTopics] = useState<Omit<Topic, 'learnedCount' | 'progress'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // FIX: Data fetching is now self-contained and sends the userId correctly.
  const fetchTopics = useCallback(async () => {
    if (!userProfile) return;
    setIsLoading(true);
    try {
      const { uid, level } = userProfile;
      const response = await fetch(`http://localhost:5001/api/topics?language=Welsh&level=${level.hierarchy}&userId=${uid}`);
      if (!response.ok) throw new Error('Failed to fetch topics');
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const learnedWordsByTopic = useMemo(() => {
    const map = new Map<string, number>();
    if (userProfile?.learnedWords) {
      for (const word of userProfile.learnedWords) {
        if (word.topicId) map.set(word.topicId, (map.get(word.topicId) || 0) + 1);
      }
    }
    return map;
  }, [userProfile?.learnedWords]);

  const topicsWithProgress: Topic[] = useMemo(() => {
    return topics.map(topic => {
      const learnedCount = learnedWordsByTopic.get(topic.id) || 0;
      const progress = topic.totalCards > 0 ? (learnedCount / topic.totalCards) * 100 : 0;
      return { ...topic, learnedCount, progress };
    });
  }, [topics, learnedWordsByTopic]);

  const filteredTopics = useMemo(() => {
    return topicsWithProgress
      .filter(topic => {
        switch (activeTab) {
          case 'Custom Topics': return topic.isCustom && topic.creatorId === userProfile?.uid;
          case 'Favorites': return topic.isFavorited;
          case 'In Progress': return topic.progress > 0 && topic.progress < 100;
          case 'Completed': return topic.progress === 100;
          default: return true;
        }
      })
      .filter(topic => topic.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [topicsWithProgress, activeTab, searchTerm, userProfile?.uid]);

  const totalPages = Math.ceil(filteredTopics.length / TOPICS_PER_PAGE);
  const paginatedTopics = filteredTopics.slice((currentPage - 1) * TOPICS_PER_PAGE, currentPage * TOPICS_PER_PAGE);

  // FIX: Favorite and Delete API calls are now handled internally.
  const handleToggleFavorite = async (topicId: string) => {
    if (!userProfile) return;
    setIsProcessing(topicId);
    try {
      await fetch('http://localhost:5001/api/user/toggle-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userProfile.uid, topicId }),
      });
      await fetchTopics(); // Refresh data
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteTopic = async (topic: Topic) => {
    if (!userProfile) return;
    setIsProcessing(topic.id);
    try {
      await fetch(`http://localhost:5001/api/topics/${'Welsh'}/${topic.difficulty}/${topic.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userProfile.uid }),
      });
      await fetchTopics(); // Refresh data
    } catch (error) {
      console.error("Failed to delete topic:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const difficultyColors: { [key: string]: string } = {
    Beginner: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
    Intermediate: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700',
    Advanced: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700',
    Master: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-16 z-30 backdrop-blur-sm">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Flashcard Topics</h1>
            <p className="text-slate-600 dark:text-slate-400">Choose a topic to master new vocabulary.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search topics..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); setCurrentPage(1); }}>
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Custom Topics">Custom</TabsTrigger>
                <TabsTrigger value="Favorites">Favorites</TabsTrigger>
                <TabsTrigger value="In Progress">In Progress</TabsTrigger>
                <TabsTrigger value="Completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-slate-400" />
            <p className="mt-4 text-slate-500">Loading topics...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all group border-dashed flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:border-yellow-500 hover:-translate-y-1" 
                onClick={() => onNavigate('create-custom-topic')}
              >
                <CardContent className="text-center p-6">
                  <PlusCircle className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-yellow-500" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 group-hover:text-yellow-500">Create Custom Topic</h3>
                </CardContent>
              </Card>

              {paginatedTopics.map((topic) => (
                <Card 
                  key={topic.id} 
                  onClick={() => onTopicSelect(topic)}
                  className="flex flex-col justify-between cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group bg-white dark:bg-slate-800"
                >
                  <div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-3xl">{topic.icon || '📚'}</div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 -mr-2 -mt-2" onClick={(e) => e.stopPropagation()}>
                               {isProcessing === topic.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleToggleFavorite(topic.id); }}>
                              <Star className={`h-4 w-4 mr-2 ${topic.isFavorited ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                              <span>{topic.isFavorited ? 'Unfavorite' : 'Favorite'}</span>
                            </DropdownMenuItem>
                            {topic.isCustom && topic.creatorId === userProfile?.uid && (
                              <DropdownMenuItem className="text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic); }}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete Topic</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg text-slate-800 dark:text-white group-hover:text-yellow-600">{topic.name}</CardTitle>
                      <Badge variant="outline" className={`${difficultyColors[topic.difficulty]} w-fit`}>{topic.difficulty}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400 h-10">{topic.description}</p>
                    </CardContent>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{topic.learnedCount} / {topic.totalCards}</span>
                    </div>
                    <Progress value={topic.progress} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(p - 1, 1)); }} />
                  </PaginationItem>
                  <PaginationItem className="text-sm text-slate-600 dark:text-slate-400">Page {currentPage} of {totalPages}</PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(p + 1, totalPages)); }} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}