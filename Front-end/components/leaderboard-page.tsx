import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Trophy, Crown, Medal } from "lucide-react";

interface LeaderboardPageProps {
  onBack: () => void;
  leaderboardData: any[]; // Expects an array of user profiles
  currentUserId: string; // To identify and highlight the current user
}

export function LeaderboardPage({ onBack, leaderboardData, currentUserId }: LeaderboardPageProps) {

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Leaderboard</h1>
              <p className="text-slate-600 dark:text-slate-300">Compete with Welsh learners worldwide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Global Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboardData.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400">No users to display on the leaderboard yet.</p>
            ) : (
              <div className="space-y-3">
                {leaderboardData.map((user, index) => (
                  <div
                    key={user.uid}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      user.uid === currentUserId
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800"
                        : "bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {getRankIcon(index + 1)}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">
                          {user.name} {user.uid === currentUserId && "(You)"}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.level.hierarchy} {user.level.level}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 dark:text-white">{user.level.points}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
