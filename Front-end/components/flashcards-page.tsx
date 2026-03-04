import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Volume2, Check, X, Trophy, Sparkles } from "lucide-react";
import './flashcard-styles.css';

interface Flashcard {
  front: string;
  back: string;
  pronunciation?: string;
}

interface FlashcardsPageProps {
  onBack: () => void;
  flashcards: Flashcard[];
  topic: { name: string; icon: string };
  learnedWords: Flashcard[];
}

export function FlashcardsPage({ onBack, flashcards, topic, learnedWords, onLearnedWord }: FlashcardsPageProps & { onLearnedWord: (word: Flashcard) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [masteredInSession, setMasteredInSession] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (!text) return;
    try {
      const response = await fetch('http://localhost:5001/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: 'cy' }),
      });
      if (!response.ok) throw new Error('Failed to fetch audio');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      setAudio(newAudio);
      newAudio.play();
    } catch (error) {
      console.error("Error in speakText function:", error);
    }
  };

  // FIX: Added a check for 'word' to prevent crash on malformed learnedWords data.
  const isAlreadyLearned = learnedWords.some(word => word && word.front === flashcards[currentIndex]?.front);

  const handleNext = (knewIt: boolean) => {
    if (knewIt) {
      const currentCard = flashcards[currentIndex];
      if (!masteredInSession.includes(currentCard.front)) {
        setSessionScore(prev => prev + 10);
        onLearnedWord(currentCard);
        setMasteredInSession(prev => [...prev, currentCard.front]);
      }
    }
    
    if (currentIndex >= flashcards.length - 1) {
      setIsComplete(true);
    } else {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150);
    }
  };
  
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionScore(0);
    setMasteredInSession([]);
    setIsComplete(false);
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
        <p className="text-slate-500 mb-4">No flashcards found for this topic.</p>
        <Button onClick={onBack} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back</Button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md text-center p-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Topic Complete!</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Da iawn! You did a great job.</p>
          <p className="text-6xl font-bold text-yellow-500 my-6">{sessionScore}</p>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 -mt-4 mb-6">Points Earned</p>
          <div className="flex flex-col space-y-2">
            <Button onClick={handleRestart}><Sparkles className="mr-2 h-4 w-4" />Practice Again</Button>
            <Button onClick={onBack} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Back to Topics</Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col p-4">
      <header className="w-full max-w-3xl mx-auto mb-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{topic.icon} {topic.name}</h1>
          </div>
          <div className="text-right font-bold text-yellow-500 text-xl w-28">
            {sessionScore} pts
          </div>
        </div>
        <Progress value={((currentIndex + 1) / flashcards.length) * 100} className="mt-2" />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
          <Card className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
            <CardContent className="flashcard-face flashcard-front">
              {isAlreadyLearned && <div className="absolute top-4 right-4 text-yellow-500"><Check className="w-6 h-6" /></div>}
              <Button variant="ghost" size="icon" className="absolute top-4 left-4 h-12 w-12" onClick={(e) => { e.stopPropagation(); speakText(currentCard.front); }}>
                <Volume2 className="h-7 w-7" />
              </Button>
              <p className="text-5xl md:text-6xl font-bold">{currentCard.front}</p>
            </CardContent>
            <CardContent className="flashcard-face flashcard-back">
              <p className="text-5xl md:text-6xl font-bold">{currentCard.back}</p>
              {currentCard.pronunciation && (
                <p className="text-xl text-slate-500 mt-4 font-mono">"{currentCard.pronunciation}"</p>
              )}
            </CardContent>
          </Card>
        </div>
        <p className="text-slate-500 mt-4">Click card to flip</p>
      </main>

      <footer className="w-full max-w-xl mx-auto mt-6 flex items-center justify-center space-x-4">
        <Button variant="outline" className="bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200 w-1/2 h-16 text-lg" onClick={() => handleNext(false)}>
          <X className="mr-2 h-6 w-6" /> Still Learning
        </Button>
        <Button className="bg-green-500 hover:bg-green-600 w-1/2 h-16 text-lg" onClick={() => handleNext(true)}>
          <Check className="mr-2 h-6 w-6" /> I Knew This
        </Button>
      </footer>
    </div>
  );
}