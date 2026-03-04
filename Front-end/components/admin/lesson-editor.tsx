import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2 } from "lucide-react";

export function LessonEditor({ lesson, onSave, onCancel }: { lesson?: any, onSave: (lessonData: any) => void, onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState([{ type: 'text', value: '' }]);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || '');
      setDescription(lesson.description || '');
      setContent(lesson.content || [{ type: 'text', value: '' }]);
    }
  }, [lesson]);

  const handleSave = () => {
    const lessonData = { title, description, content };
    onSave(lesson ? { ...lesson, ...lessonData } : lessonData);
  };

  const handleContentChange = (index: number, value: string) => {
    const newContent = [...content];
    newContent[index].value = value;
    setContent(newContent);
  };

  const addContentField = () => {
    setContent([...content, { type: 'text', value: '' }]);
  };

  const removeContentField = (index: number) => {
    const newContent = content.filter((_, i) => i !== index);
    setContent(newContent);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{lesson ? 'Edit Lesson' : 'Create New Lesson'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}><X className="w-5 h-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="lesson-title">Lesson Title</Label>
            <Input id="lesson-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Basic Welsh Greetings" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-description">Description</Label>
            <Textarea id="lesson-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short summary of what this lesson covers." />
          </div>
          <div className="space-y-4">
            <Label>Lesson Content</Label>
            {content.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Textarea
                  value={item.value}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  placeholder={`Paragraph ${index + 1}`}
                  className="flex-grow"
                />
                <Button variant="destructive" size="icon" onClick={() => removeContentField(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addContentField}>
              <Plus className="w-4 h-4 mr-2" /> Add Paragraph
            </Button>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Lesson</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
