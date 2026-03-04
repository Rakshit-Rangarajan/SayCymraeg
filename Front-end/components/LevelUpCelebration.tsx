// FIX: Added 'useState' to the import from React.
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { Level } from './levelingSystem';

// A simple hook to play sound
const useAudio = (url: string) => {
  const [audio] = useState(new Audio(url));
  const play = () => {
    audio.currentTime = 0;
    audio.play().catch(e => console.error("Audio play failed:", e));
  };
  return play;
};

export function LevelUpCelebration({ newLevel, onComplete }: { newLevel: Level, onComplete: () => void }) {
  const playSound = useAudio("https://www.myinstants.com/media/sounds/zelda-secret-sound.mp3");

  useEffect(() => {
    playSound();
  }, [playSound]);

  return (
    <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center animate-in fade-in">
      {/* Basic fireworks effect with CSS */}
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
      
      <Card className="w-full max-w-sm text-center animate-in zoom-in-95 slide-in-from-bottom-10">
        <CardHeader>
          <PartyPopper className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">LEVEL UP!</CardTitle>
          <CardDescription className="text-lg text-slate-600">You've reached</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-purple-600">
            {newLevel.hierarchy} {newLevel.level}
          </p>
          <Button onClick={onComplete} className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
            Continue
          </Button>
        </CardContent>
      </Card>

      <style>{`
        .firework {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #ffc700;
          border-radius: 50%;
          animation: firework-anim 1.2s both infinite;
        }
        .firework:nth-child(2) { left: 20%; top: 30%; animation-delay: 0.3s; }
        .firework:nth-child(3) { right: 15%; top: 60%; animation-delay: 0.8s; }
        @keyframes firework-anim {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(20); opacity: 0; }
        }
      `}</style>
    </div>
  );
}