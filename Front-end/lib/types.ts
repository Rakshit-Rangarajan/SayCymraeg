// lib/types.ts

export type Screen =
  | "onboarding"
  | "dashboard"
  | "flashcards"
  | "pronunciation"
  | "quiz-welcome"
  | "quiz-progress"
  | "quiz-results"
  | "level-quiz"
  | "hierarchy-test"
  | "chat"
  | "forums" // Added forums
  | "leaderboard"
  | "profile"
  | "settings"
  | "stats"
  | "account"
  | "admin"
  | "social"
  | "multiplayer";

export type UserLevel = {
  hierarchy: "Beginner" | "Intermediate" | "Advanced" | "Master";
  level: number;
  points: number;
  totalPoints: number;
};

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  avatarUrl?: string;
  level: UserLevel;
  streak: number;
  dailyProgress: number;
  isAdmin: boolean;
  // any other user-specific fields
}

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned: boolean;
  dateEarned?: Date;
};