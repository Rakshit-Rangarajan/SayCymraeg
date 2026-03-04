import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Award, Flame, BookOpen, Trophy, Clock, ArrowLeft } from "lucide-react";
import { getXpForNextLevel } from "./levelingSystem";
import { Button } from "@/components/ui/button";

interface StatsPageProps {
  onBack: () => void;
  userProfile: any;
  topics: any[];
  fetchTopics: () => void;
}

export function StatsPage({ onBack, userProfile, topics, fetchTopics }: StatsPageProps) {
  useEffect(() => {
    if (!topics || topics.length === 0) {
      fetchTopics();
    }
  }, [topics, fetchTopics]);

  const { streak, level, learnedWords } = userProfile;
  const wordsLearned = learnedWords?.length || 0;
  
  const xpForNextLevel = getXpForNextLevel(level);
  const levelProgress = xpForNextLevel !== Infinity ? (level.points / xpForNextLevel) * 100 : 100;

  const learnedWordsByTopic = useMemo(() => {
    const map = new Map<string, number>();
    if (learnedWords) {
      for (const word of learnedWords) {
        if (word.topicId) {
          map.set(word.topicId, (map.get(word.topicId) || 0) + 1);
        }
      }
    }
    return map;
  }, [learnedWords]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2"><ArrowLeft className="w-5 h-5" /></Button>
            <BarChart3 className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Your Statistics</h1>
        </div>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardHeader>
            <CardTitle>{level.hierarchy} {level.level}</CardTitle>
            <CardDescription className="text-purple-200">Your current level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-1 text-purple-100">
              <span>Level Progress</span>
              <span>{level.points} / {xpForNextLevel === Infinity ? 'MAX' : xpForNextLevel} XP</span>
            </div>
            <Progress value={levelProgress} className="h-3 bg-white/30" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-6 text-center"><BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" /><div className="text-2xl font-bold">{wordsLearned}</div><p className="text-sm text-slate-600">Words Learned</p></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><Flame className="w-8 h-8 text-yellow-500 mx-auto mb-2" /><div className="text-2xl font-bold">{streak}</div><p className="text-sm text-slate-600">Day Streak</p></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" /><div className="text-2xl font-bold">{userProfile.level.points}</div><p className="text-sm text-slate-600">Current XP</p></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><Award className="w-8 h-8 text-blue-500 mx-auto mb-2" /><div className="text-2xl font-bold">0</div><p className="text-sm text-slate-600">Achievements</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center space-x-2"><TrendingUp className="w-5 h-5 text-purple-500" /><span>Topic Mastery</span></CardTitle></CardHeader>
          <CardContent>
            {topics.length > 0 ? (
              <div className="space-y-4">
                {topics.map((topic, index) => {
                  const learnedCount = learnedWordsByTopic.get(topic.id) || 0;
                  const progress = topic.totalCards > 0 ? (learnedCount / topic.totalCards) * 100 : 0;
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">{topic.name}</span>
                        <span className="text-sm text-slate-600">{learnedCount} / {topic.totalCards}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">No topics available. Start learning to see your mastery!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
