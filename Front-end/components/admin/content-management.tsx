import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { LessonEditor } from './lesson-editor'; // Import the new editor

interface ContentManagementPageProps {
  lessons: any[];
  onSaveLesson: (lessonData: any) => void;
  onDeleteLesson: (lessonId: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export function ContentManagementPage({ lessons, onSaveLesson, onDeleteLesson, showToast }: ContentManagementPageProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  const handleSave = async (lessonData: any) => {
    try {
      await onSaveLesson(lessonData);
      showToast(editingLesson ? "Lesson updated successfully!" : "Lesson created successfully!", "success");
      setIsEditorOpen(false);
      setEditingLesson(null);
    } catch (error) {
      showToast("Failed to save lesson.", "error");
    }
  };
  
  const handleDelete = async (lessonId: string) => {
      if(window.confirm("Are you sure you want to delete this lesson?")) {
          try {
              await onDeleteLesson(lessonId);
              showToast("Lesson deleted successfully!", "success");
          } catch(e) {
              showToast("Failed to delete lesson.", "error");
          }
      }
  };

  const openEditorForNew = () => {
    setEditingLesson(null);
    setIsEditorOpen(true);
  };

  const openEditorForEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setIsEditorOpen(true);
  };

  return (
    <div>
      {isEditorOpen && <LessonEditor lesson={editingLesson} onSave={handleSave} onCancel={() => setIsEditorOpen(false)} />}
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Lessons</CardTitle>
              <CardDescription>Create, edit, and delete learning modules.</CardDescription>
            </div>
            <Button onClick={openEditorForNew}>
              <Plus className="w-4 h-4 mr-2" /> Create Lesson
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lessons.length > 0 ? lessons.map(lesson => (
            <div key={lesson.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">{lesson.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{lesson.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => openEditorForEdit(lesson)}>
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(lesson.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )) : (
            <p className="text-center text-slate-500 py-8">No lessons created yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
