"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, RotateCcw, CheckCircle, XCircle, Target, ArrowLeft, Loader2 } from "lucide-react";

interface PronunciationPracticeProps {
  onBack: () => void;
  speakText: (text: string) => void;
  userLevel: string;
}

interface WordData {
  welsh: string;
  english: string;
  pronunciation: string;
}

interface Feedback {
  score: number;
  transcribedText: string;
  error?: string;
}

export function PronunciationPractice({ onBack, speakText, userLevel }: PronunciationPracticeProps) {
  const [words, setWords] = useState<WordData[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [feedbackList, setFeedbackList] = useState<(Feedback | null)[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/get-practice-words?level=${userLevel}`);
        const data: WordData[] = await response.json();
        setWords(data);
        setFeedbackList(new Array(data.length).fill(null));
      } catch (error) {
        console.error("Failed to fetch practice words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, [userLevel]);

  const handleStartRecording = async () => {
    if (isListening) {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsListening(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
    }
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    const targetText = words[currentWordIndex].welsh;
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('targetText', targetText);

    try {
      const response = await fetch('http://localhost:5001/api/analyze-speech', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      const newFeedback = [...feedbackList];
      newFeedback[currentWordIndex] = result;
      setFeedbackList(newFeedback);
      
      // Automatically move to next word after a short delay
      setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
        } else {
          setIsComplete(true);
        }
      }, 1500);

    } catch (error) {
      console.error("Error analyzing speech:", error);
    } finally {
      setIsListening(false);
    }
  };
  
  const currentWord = words[currentWordIndex];
  const currentFeedback = feedbackList[currentWordIndex];

  const totalScore = feedbackList.reduce((acc, f) => acc + (f ? f.score : 0), 0);
  const averageScore = feedbackList.filter(f => f !== null).length > 0 ? totalScore / feedbackList.filter(f => f !== null).length : 0;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-green-500" /></div>;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Practice Complete!</CardTitle>
            <CardDescription>Da iawn! You did a great job.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-5xl font-bold text-green-500">{Math.round(averageScore)}%</p>
            <p className="text-slate-600 dark:text-slate-400">Average Score</p>
            <Progress value={averageScore} className="green" />
            <div className="flex justify-center space-x-4 pt-4">
              <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Back to Learn</Button>
              <Button onClick={() => window.location.reload()}><RotateCcw className="w-4 h-4 mr-2" />Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
            <Progress value={((currentWordIndex + 1) / words.length) * 100} className="w-1/2" />
            <div className="text-slate-600 dark:text-slate-400 font-medium">
              {currentWordIndex + 1} / {words.length}
            </div>
        </div>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-slate-800 dark:text-white">{currentWord.welsh}</CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-300">{currentWord.english}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4 mb-6">
              <Button variant="outline" size="lg" onClick={() => speakText(currentWord.welsh)}><Volume2 className="w-5 h-5 mr-2" />Listen</Button>
              <Button
                size="lg"
                onClick={handleStartRecording}
                disabled={isListening}
                className={`flex items-center space-x-2 ${isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-green-500 hover:bg-green-600"} text-white`}
              >
                <Mic className="w-5 h-5" />
                <span>{isListening ? "Listening..." : "Speak Now"}</span>
              </Button>
            </div>
            
            <div className="h-20 flex justify-center items-center">
              {currentFeedback && (
                <div className="flex items-center space-x-2 animate-in fade-in">
                  {currentFeedback.score >= 50 ? <CheckCircle className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
                  <span className={`text-2xl font-bold ${currentFeedback.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(currentFeedback.score)}%
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
