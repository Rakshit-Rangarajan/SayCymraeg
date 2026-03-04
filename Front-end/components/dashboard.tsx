import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Flame, Target, TrendingUp, Users, Mic, Languages, BarChart3, Star, ArrowRight, Volume2, AlertTriangle } from "lucide-react";

// FIX: Removed speakText from props to make the component self-contained.
interface DashboardProps {
  userLevel: any;
  userStreak: number;
  dailyProgress: number;
  topics: any[];
  onNavigate: (screen: string) => void;
  onTopicSelect: (topic: any) => void;
  speakText: (text: string) => Promise<void>;
}

export function Dashboard({ userLevel, userStreak, dailyProgress, topics, onNavigate, onTopicSelect }: DashboardProps) {
  const [wordOfTheDay, setWordOfTheDay] = useState({
    welsh: "Llwytho...", // Welsh for "Loading..."
    english: "Loading...",
    pronunciation: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  // --- FIX START: Self-contained text-to-speech logic ---
  // State to manage the audio object
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // The entire speakText function is now defined directly inside this component.
  const speakText = async (text: string, lang: string = 'cy') => {
    // If different audio is already playing, stop it first.
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (!text) return; // Don't try to speak empty text

    try {
      const response = await fetch('http://localhost:5001/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      setAudio(newAudio); // Save the new audio object to state
      newAudio.play();
    } catch (error) {
      console.error("Error in speakText function:", error);
    }
  };
  // --- FIX END ---

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/word-of-the-day');
        if (!response.ok) {
          throw new Error('Failed to fetch word of the day');
        }
        const data = await response.json();
        setWordOfTheDay(data);
      } catch (error) {
        console.error("Error fetching Word of the Day:", error);
        setApiError("Could not connect to the API server. Is it running?");
        setWordOfTheDay({
          welsh: "Gwall", // Welsh for "Error"
          english: "Error",
          pronunciation: "Could not load word.",
        });
      }
    };

    fetchWordOfTheDay();
  }, []);

  const quickStats = {
    wordsLearned: 247,
    lessonsCompleted: 23,
    currentStreak: userStreak,
    weeklyGoal: 75,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Croeso nôl! 👋</h1>
              <p className="text-yellow-100 text-lg">Ready to continue your Welsh journey?</p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white border-white/30 mb-2">
                {userLevel.hierarchy} {userLevel.level}
              </Badge>
              <div className="text-2xl font-bold">{userLevel.points} XP</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{quickStats.wordsLearned}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Words Learned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{quickStats.lessonsCompleted}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Lessons Done</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{quickStats.currentStreak}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Day Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{quickStats.weeklyGoal}%</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Weekly Goal</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Word of the Day */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="dark:text-white">Word of the Day</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {apiError ? (
                    <div className="text-red-500 flex flex-col items-center justify-center h-full">
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <p className="font-semibold">API Connection Error</p>
                        <p className="text-sm">{apiError}</p>
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{wordOfTheDay.welsh}</div>
                        <div className="text-lg text-slate-600 dark:text-slate-300 mb-2">{wordOfTheDay.english}</div>
                        <div className="text-slate-500 dark:text-slate-400 font-mono">{wordOfTheDay.pronunciation}</div>
                        <div className="flex justify-center space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => speakText(wordOfTheDay.welsh)}
                            className="bg-transparent"
                            disabled={!wordOfTheDay.welsh || wordOfTheDay.welsh === "Llwytho..." || wordOfTheDay.welsh === "Gwall"}
                          >
                            <Volume2 className="w-4 h-4 mr-1" />
                            Listen
                          </Button>
                        </div>
                    </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("learn")}>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Continue Learning</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Pick up where you left off</p>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Go to Learn <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("pronunciation-tutor")}>
                <CardContent className="p-6 text-center">
                  <Mic className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Pronunciation Practice</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Improve your pronunciation</p>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                    Start Speaking <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("chat")}>
                <CardContent className="p-6 text-center">
                  <Languages className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">AI Chat</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Practice conversations</p>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Start Chat <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("social")}>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Challenge Friends</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Compete and learn together</p>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Find Match <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="dark:text-white">Today's Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Daily Goal</span>
                  <span className="font-medium text-slate-800 dark:text-white">{dailyProgress}%</span>
                </div>
                <Progress value={dailyProgress} className="h-2" />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span className="dark:text-white">Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Best streak</span>
                    <span className="font-medium text-slate-800 dark:text-white">12 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Rank</span>
                    <span className="font-medium text-slate-800 dark:text-white">#6</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => onNavigate("stats")}>
                  View Detailed Stats
                  <BarChart3 className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}