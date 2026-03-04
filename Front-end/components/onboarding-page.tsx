import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Users, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const onboardingSlides = [
    {
      title: "Learn Welsh Naturally",
      description: "Master Cymraeg with interactive lessons, real conversations, and personalized learning paths.",
      icon: <BookOpen className="w-16 h-16 text-green-500" />,
    },
    {
      title: "Practice Every Day",
      description: "Build your skills with daily challenges, flashcards, and pronunciation practice.",
      icon: <Brain className="w-16 h-16 text-blue-400" />,
    },
    {
      title: "Compete & Connect",
      description: "Join the community, climb leaderboards, and chat with AI tutors in Welsh.",
      icon: <Users className="w-16 h-16 text-yellow-500" />,
    },
];

interface OnboardingPageProps {
    onboardingStep: number;
    setOnboardingStep: (step: number) => void;
    onComplete: () => void;
}

export function OnboardingPage({ onboardingStep, setOnboardingStep, onComplete }: OnboardingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">{onboardingSlides[onboardingStep].icon}</div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            {onboardingSlides[onboardingStep].title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            {onboardingSlides[onboardingStep].description}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {onboardingSlides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === onboardingStep ? "bg-yellow-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setOnboardingStep(Math.max(0, onboardingStep - 1))}
            disabled={onboardingStep === 0}
            className="text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {onboardingStep < onboardingSlides.length - 1 ? (
            <Button
              onClick={() => setOnboardingStep(onboardingStep + 1)}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
