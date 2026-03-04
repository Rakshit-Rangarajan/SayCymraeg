import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, CheckCircle, Loader2 } from "lucide-react";

interface AccountPageProps {
  onBack: () => void;
  userProfile: any;
  onUpdateProfile: (updates: { name?: string; bio?: string; }, newAvatarFile?: File) => Promise<void>;
}

export function AccountPage({ onBack, userProfile, onUpdateProfile }: AccountPageProps) {
  const [name, setName] = useState(userProfile.name || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(userProfile.avatarUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await onUpdateProfile({ name, bio }, avatarFile || undefined);
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setSaveMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
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
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Account</h1>
            <p className="text-slate-600 dark:text-slate-300">Update your profile and settings</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={previewUrl || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="text-2xl">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 w-8 h-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Profile Picture</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Click the camera to upload a new avatar.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="dark:text-white">Full Name</Label>
              <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="dark:text-white">Bio</Label>
              <Textarea id="bio" placeholder="Tell us a bit about your learning journey..." value={bio} onChange={(e) => setBio(e.target.value)} />
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
          <Button onClick={handleSave} disabled={isSaving} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
