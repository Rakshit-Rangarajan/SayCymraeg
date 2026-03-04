import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Bell, Volume2, Moon, Sun, Globe, Shield, Smartphone, User, Crown, CheckCircle } from "lucide-react";

interface SettingsPageProps {
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (screen: string) => void;
  isAdmin: boolean;
}

export function SettingsPage({ onBack, darkMode, onToggleDarkMode, onNavigate, isAdmin }: SettingsPageProps) {
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // State for UI elements is kept local for now. We can connect this to Firestore later.
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    streakAlerts: true,
  });

  const [audioSettings, setAudioSettings] = useState({
    volume: [75],
  });

  const [learningSettings, setLearningSettings] = useState({
    dailyGoal: 15,
  });

  const handleSave = () => {
    // In a real app, you would save these settings to the user's profile in Firestore.
    // For now, we'll just show a confirmation message.
    setSaveMessage("Settings saved successfully!");
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000); // Hide the message after 3 seconds
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
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
              <p className="text-slate-600 dark:text-slate-300">Customize your learning experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-500" />
              <span className="dark:text-white">Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium dark:text-white">Profile Settings</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage your profile and account details</p>
              </div>
              <Button variant="outline" onClick={() => onNavigate("account")} className="bg-transparent">
                Manage Account
              </Button>
            </div>

            {/* This button will now correctly appear only for admin users */}
            {isAdmin && (
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-3">
                  <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <Label className="text-base font-medium text-purple-800 dark:text-purple-200">Admin Panel</Label>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Access administrative features</p>
                  </div>
                </div>
                <Button onClick={() => onNavigate("admin")} className="bg-purple-500 hover:bg-purple-600 text-white">
                  Open Admin Panel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {darkMode ? <Moon className="w-5 h-5 text-purple-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              <span className="dark:text-white">Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium dark:text-white">Dark Mode</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Switch between light and dark themes</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-green-500" />
              <span className="dark:text-white">Learning Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium dark:text-white">Daily Goal (minutes)</Label>
                <Badge variant="outline">{learningSettings.dailyGoal} min</Badge>
              </div>
              <Slider
                value={[learningSettings.dailyGoal]}
                onValueChange={(value) => setLearningSettings({ ...learningSettings, dailyGoal: value[0] })}
                max={60}
                min={5}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-blue-500" />
              <span className="dark:text-white">Audio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium dark:text-white">Volume</Label>
                <Badge variant="outline">{audioSettings.volume[0]}%</Badge>
              </div>
              <Slider
                value={audioSettings.volume}
                onValueChange={(value) => setAudioSettings({ ...audioSettings, volume: value })}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <span className="dark:text-white">Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium dark:text-white">Daily Reminders</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Get reminded to practice daily</p>
              </div>
              <Switch
                checked={notifications.dailyReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, dailyReminders: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium dark:text-white">Streak Alerts</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Notifications about your learning streak</p>
              </div>
              <Switch
                checked={notifications.streakAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, streakAlerts: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end items-center space-x-4">
          {saveMessage && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{saveMessage}</span>
            </div>
          )}
          <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
