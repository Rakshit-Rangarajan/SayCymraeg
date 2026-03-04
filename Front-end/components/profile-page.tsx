import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, BarChart3, Users, Settings } from 'lucide-react';
import { getXpForNextLevel } from './levelingSystem'; // Assuming this utility exists

// Dummy data for achievements, replace with real data structure
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
}

interface ProfilePageProps {
  userProfile: any;
  achievements?: Achievement[]; // Made optional
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export function ProfilePage({ userProfile, achievements, onBack, onNavigate }: ProfilePageProps) {
  if (!userProfile) {
    return <div>Loading profile...</div>;
  }

  const { name, avatarUrl, level, streak, bio, joinDate } = userProfile;
  const xpForNextLevel = getXpForNextLevel(level);
  const levelProgress = xpForNextLevel !== Infinity ? (level.points / xpForNextLevel) * 100 : 100;

  // FIX: Safely handle the achievements array by providing a default empty array.
  const earnedAchievements = (achievements || []).filter(a => a.earned);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Your Profile</h1>
        </header>

        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-yellow-400">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-3xl">{name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{name}</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{bio || "No bio yet. Click Edit Profile to add one!"}</p>
              <div className="flex justify-center md:justify-start items-center space-x-4 mt-4 text-sm text-slate-500">
                <span>Joined: {new Date(joinDate?.seconds * 1000).toLocaleDateString()}</span>
                <span>🔥 {streak || 0} Day Streak</span>
              </div>
            </div>
            <Button onClick={() => onNavigate('settings')}>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-lg">{level.hierarchy} {level.level}</Badge>
              <span className="font-mono text-slate-600 dark:text-slate-400">{level.points} / {xpForNextLevel} XP</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Achievements</span>
                {/* FIX: Use the safe variable here */}
                <Badge variant="outline">{earnedAchievements.length}/{achievements?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* You would map over earnedAchievements here */}
              <p className="text-sm text-slate-500">Your earned achievements will be displayed here.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('stats')}><BarChart3 className="mr-2 h-4 w-4" /> View Stats</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('social')}><Users className="mr-2 h-4 w-4" /> Friends & Social</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('settings')}><Settings className="mr-2 h-4 w-4" /> Account Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}