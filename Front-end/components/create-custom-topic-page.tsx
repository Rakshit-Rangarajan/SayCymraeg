import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Sparkles, Loader2, RotateCcw } from "lucide-react";

interface UserProfile {
  uid: string;
  level: { hierarchy: string };
}

interface CreateCustomTopicPageProps {
  onBack: () => void;
  onTopicCreated: () => void;
  userProfile: UserProfile | null;
}

const ALL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Master'];
const MAX_DESCRIPTION_LENGTH = 500;

export function CreateCustomTopicPage({ onBack, onTopicCreated, userProfile }: CreateCustomTopicPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [numFlashcards, setNumFlashcards] = useState(20);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userHierarchy = userProfile?.level?.hierarchy ?? 'Beginner';
    const userLevelIndex = ALL_LEVELS.indexOf(userHierarchy);
    const accessibleLevels = userLevelIndex > -1 ? ALL_LEVELS.slice(0, userLevelIndex + 1) : [ALL_LEVELS[0]];
    setAvailableLevels(accessibleLevels);
    setSelectedLevel(userHierarchy);
  }, [userProfile]);

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setSelectedLevel(userProfile?.level?.hierarchy ?? 'Beginner');
    setNumFlashcards(20);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !selectedLevel || !userProfile || isLoading) {
        console.error("Submit blocked: Missing data or still loading.", { description, selectedLevel, userProfile, isLoading });
        return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.uid,
          title: title.trim(),
          description: description.trim(),
          level: selectedLevel,
          language: 'Welsh',
          numFlashcards: numFlashcards
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create topic');
      }
      
      await response.json();
      onTopicCreated();

    } catch (error) {
      console.error("Error creating custom topic:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const remainingChars = MAX_DESCRIPTION_LENGTH - description.length;
  const isSubmitDisabled = !description.trim() || isLoading || !userProfile;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center relative mb-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="absolute -left-4 top-1/2 -translate-y-1/2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center flex-grow">
              <CardTitle className="text-2xl">Generate a Custom Topic</CardTitle>
              <CardDescription>Use AI to create a personalized learning deck.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topicTitle">Topic Title (Optional)</Label>
              <Input
                id="topicTitle"
                placeholder="e.g., 'Ordering Coffee'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you want to learn. For example: 'I want to learn phrases for booking a hotel room, asking for the Wi-Fi, and checking out.'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                required
                maxLength={MAX_DESCRIPTION_LENGTH}
                className="min-h-[120px]"
              />
               <p className={`text-xs text-right ${remainingChars < 20 ? 'text-red-500' : 'text-slate-500'}`}>
                {remainingChars} characters remaining
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  {/* FIX: Removed the '!userProfile' check to ensure the dropdown is always enabled unless actively loading. */}
                  <Select value={selectedLevel} onValueChange={setSelectedLevel} disabled={isLoading}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select a level..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="numFlashcards">Number of Flashcards</Label>
                    <div className="flex items-center gap-4 pt-2">
                        <Slider
                            id="numFlashcards"
                            min={5}
                            max={30}
                            step={5}
                            value={[numFlashcards]}
                            onValueChange={(value) => setNumFlashcards(value[0])}
                            disabled={isLoading}
                        />
                        <span className="text-lg font-semibold w-8 text-center">{numFlashcards}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleReset} className="w-1/3" disabled={isLoading}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button type="submit" className="w-2/3" disabled={isSubmitDisabled}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Flashcards...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}