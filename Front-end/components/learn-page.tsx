import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Mic, Layers, Star } from "lucide-react";

interface LearnPageProps {
  onNavigate: (screen: string) => void;
}

export function LearnPage({ onNavigate }: LearnPageProps) {
  const learningOptions = [
    {
      title: "Pronunciation Tutor",
      description: "Get guided practice on single words and improve your accent.",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      screen: "pronunciation-tutor",
      color: "yellow"
    },
    {
      title: "Pronunciation Practice",
      description: "Test your speaking skills with a series of words.",
      icon: <Mic className="w-6 h-6 text-green-500" />,
      screen: "pronunciation-practice",
      color: "green"
    },
    {
      title: "Flashcard Topics",
      description: "Master vocabulary with flashcards from various topics.",
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      screen: "flashcard-topics",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Dechrau Dysgu (Start Learning)</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Choose an activity to begin your Welsh journey.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {learningOptions.map((opt) => (
            <Card 
              key={opt.screen}
              onClick={() => onNavigate(opt.screen)} 
              className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{opt.title}</span>
                  {opt.icon}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4 h-16">{opt.description}</p>
                <div className={`flex items-center text-${opt.color}-500 font-semibold mt-4 group-hover:text-${opt.color}-600`}>
                  Start Now <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
