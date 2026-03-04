import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Star, Loader2, AlertTriangle } from "lucide-react";

interface CompetitiveQuizProps {
  onBack: () => void;
  learnedWords: string[]; // Receive the list of learned words
  onQuizComplete: (score: number) => void;
}

interface Question {
    question: string;
    options: string[];
    correct: number;
}

interface QuizData {
    title: string;
    questions: Question[];
}

export function CompetitiveQuiz({ onBack, learnedWords, onQuizComplete }: CompetitiveQuizProps) {
  const [gameMode, setGameMode] = useState<"loading" | "playing" | "results" | "error">("loading");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Effect to generate the quiz via the backend API
  useEffect(() => {
    const generateQuiz = async () => {
        if (learnedWords.length < 3) {
            setError("You need to learn at least 3 words to generate a quiz.");
            setGameMode("error");
            return;
        }
        setGameMode("loading");
        try {
            const response = await fetch('http://localhost:5001/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ words: learnedWords })
            });
            if (!response.ok) {
                throw new Error("Failed to generate quiz from API.");
            }
            const data = await response.json();
            setQuizData(data);
            setGameMode("playing");
        } catch (err) {
            console.error(err);
            setError("Could not create a quiz. Please try again later.");
            setGameMode("error");
        }
    };
    generateQuiz();
  }, [learnedWords]);

  // Timer effect
  useEffect(() => {
    if (gameMode === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameMode === "playing") {
      handleNextQuestion();
    }
  }, [timeLeft, gameMode]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    if (quizData && answerIndex === quizData.questions[currentQuestion].correct) {
      setScore(score + 100);
    }
    setTimeout(() => handleNextQuestion(), 1000);
  };

  const handleNextQuestion = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setGameMode("results");
      onQuizComplete(score);
    }
  };

  if (gameMode === "loading") {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
              <p className="mt-4 text-lg">Generating your personalized quiz...</p>
          </div>
      );
  }
  
  if (gameMode === "error") {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p className="mb-4">{error}</p>
              <Button onClick={onBack}>Back to Dashboard</Button>
          </div>
      );
  }

  if (gameMode === "results" || !quizData) {
      return (
          <div className="min-h-screen flex items-center justify-center text-center p-4">
              <Card className="w-full max-w-md">
                  <CardHeader>
                      <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-lg mb-4">You scored:</p>
                      <p className="text-4xl font-bold mb-6">{score} points</p>
                      <Button onClick={onBack} className="w-full bg-yellow-500 hover:bg-yellow-600">Back to Dashboard</Button>
                  </CardContent>
              </Card>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{quizData.title}</h1>
        {/* Rest of the quiz UI remains the same */}
      </div>
    </div>
  );
}
