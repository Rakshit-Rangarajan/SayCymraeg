"use client"
import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft, Shield, Users, Award, Plus, Edit3, Trash2, Search, Bell, AlertTriangle, BookOpen, CheckCircle, XCircle
} from "lucide-react"
import { ContentManagementPage } from "./admin/content-management"

// --- Helper Components ---
const EditUserModal = ({ user, onUpdate, onCancel }: any) => {
    const [userData, setUserData] = useState(user);
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
                <CardHeader><CardTitle>Edit User: {user.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Name</Label><Input value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} /></div>
                    <div className="flex items-center space-x-2"><Switch id="isAdmin" checked={userData.isAdmin} onCheckedChange={checked => setUserData({...userData, isAdmin: checked})} /><Label htmlFor="isAdmin">Administrator</Label></div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                        <Button onClick={() => onUpdate(userData)}>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const DeleteUserDialog = ({ user, onConfirm, onCancel }: any) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
            <CardHeader><CardTitle className="flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-red-500"/>Confirm Deletion</CardTitle></CardHeader>
            <CardContent>
                <p>Are you sure you want to delete the user <strong>{user.name}</strong>? This action cannot be undone.</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Delete User</Button>
                </div>
            </CardContent>
        </Card>
    </div>
);

// --- Component Props Interface ---
interface AdminPageProps {
  onBack: () => void;
  allUsers: any[];
  achievements: any[];
  lessons: any[];
  systemSettings: any;
  showToast: (message: string, type: 'success' | 'error') => void;
  onCreateAchievement: (achievementData: any) => Promise<void>;
  onUpdateUser: (userId: string, updates: any) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onUpdateSystemSettings: (settings: any) => Promise<void>;
  onSendNotification: (notification: any) => Promise<void>;
  onSaveLesson: (lessonData: any) => Promise<void>;
  onDeleteLesson: (lessonId: string) => Promise<void>;
}

export function AdminPage({ 
    onBack, 
    allUsers, 
    achievements, 
    lessons,
    systemSettings, 
    showToast, 
    onCreateAchievement, 
    onUpdateUser, 
    onDeleteUser, 
    onUpdateSystemSettings, 
    onSendNotification,
    onSaveLesson,
    onDeleteLesson
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [notification, setNotification] = useState({ title: "", message: "" });
  const [newAchievement, setNewAchievement] = useState({ name: "", description: "", icon: "🏆", points: 100 });

  const systemStats = useMemo(() => ({ totalUsers: allUsers.length, activeUsers: allUsers.filter(u => u.status !== "inactive").length, totalAchievements: achievements.length }), [allUsers, achievements]);
  const recentUsers = useMemo(() => [...allUsers].sort((a, b) => (b.joinDate?.seconds || 0) - (a.joinDate?.seconds || 0)).slice(0, 5), [allUsers]);
  const filteredUsers = useMemo(() => allUsers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())), [allUsers, searchQuery]);

  const handleCreateAchievement = async () => {
    if (!newAchievement.name || !newAchievement.description) return showToast("Achievement name and description are required.", "error");
    try { await onCreateAchievement(newAchievement); showToast("Achievement created successfully!", "success"); setNewAchievement({ name: "", description: "", icon: "🏆", points: 100 }); } catch (e) { showToast("Failed to create achievement.", "error"); }
  };

  const handleUpdateUser = async (updatedUser: any) => {
    try { await onUpdateUser(updatedUser.uid, { name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin }); showToast("User updated successfully!", "success"); setEditingUser(null); } catch (e) { showToast("Failed to update user.", "error"); }
  };

  const handleDeleteUserConfirm = async () => {
    if (!deletingUser) return;
    try { await onDeleteUser(deletingUser.uid); showToast("User deleted successfully!", "success"); setDeletingUser(null); } catch (e) { showToast("Failed to delete user.", "error"); }
  };
  
  const handleUpdateSystemSettings = async (settings: any) => {
    try { await onUpdateSystemSettings(settings); showToast("Settings updated successfully!", "success"); } catch (e) { showToast("Failed to update settings.", "error"); }
  };

  const handleSendNotificationClick = async () => {
      if (!notification.title || !notification.message) return showToast("Notification title and message are required.", "error");
      try { await onSendNotification(notification); showToast("Notification sent to all users!", "success"); setNotification({ title: "", message: "" }); } catch (e) { showToast("Failed to send notification.", "error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {editingUser && <EditUserModal user={editingUser} onUpdate={handleUpdateUser} onCancel={() => setEditingUser(null)} />}
      {deletingUser && <DeleteUserDialog user={deletingUser} onConfirm={handleDeleteUserConfirm} onCancel={() => setDeletingUser(null)} />}
      
      <div className="bg-white dark:bg-slate-800 border-b px-6 py-4"><div className="flex items-center space-x-4"><Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button><div className="flex items-center space-x-3"><div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg"><Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div><div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Panel</h1><p className="text-slate-600 dark:text-slate-300">Manage SayCymraeg platform</p></div></div></div></div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card><CardContent className="p-4 text-center"><Users className="w-8 h-8 text-blue-500 mx-auto mb-2" /><div className="text-2xl font-bold">{systemStats.totalUsers}</div><p className="text-sm text-slate-600">Total Users</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"><div className="w-3 h-3 bg-green-500 rounded-full"/></div><div className="text-2xl font-bold">{systemStats.activeUsers}</div><p className="text-sm text-slate-600">Active Users</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" /><div className="text-2xl font-bold">{systemStats.totalAchievements}</div><p className="text-sm text-slate-600">Achievements</p></CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle>Recent Registrations</CardTitle></CardHeader><CardContent><div className="space-y-3">{recentUsers.map((user) => (<div key={user.uid} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div><p className="font-medium">{user.name}</p><p className="text-sm text-slate-600">{user.email}</p></div><Badge>{user.status || 'active'}</Badge></div>))}</div></CardContent></Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Input placeholder="Search by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-4 text-left font-medium">User</th><th className="p-4 text-left font-medium">Level</th><th className="p-4 text-left font-medium">Joined</th><th className="p-4 text-left font-medium">Admin</th><th className="p-4 text-left font-medium">Actions</th></tr></thead>
                <tbody>{filteredUsers.map((user) => (<tr key={user.uid} className="border-t">
                    <td className="p-4"><div><p className="font-medium">{user.name}</p><p className="text-sm text-slate-600">{user.email}</p></div></td>
                    <td className="p-4"><Badge variant="outline">{user.level.hierarchy} {user.level.level}</Badge></td>
                    <td className="p-4">{user.joinDate?.seconds ? new Date(user.joinDate.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4">{user.isAdmin ? <Badge>Admin</Badge> : <Badge variant="secondary">User</Badge>}</td>
                    <td className="p-4"><div className="flex space-x-2"><Button variant="outline" size="icon" onClick={() => setEditingUser(user)}><Edit3 className="w-4 h-4" /></Button><Button variant="destructive" size="icon" onClick={() => setDeletingUser(user)}><Trash2 className="w-4 h-4" /></Button></div></td>
                </tr>))}</tbody>
            </table></div></CardContent></Card>
          </TabsContent>

          <TabsContent value="content">
            <ContentManagementPage 
                lessons={lessons}
                onSaveLesson={onSaveLesson}
                onDeleteLesson={onDeleteLesson}
                showToast={showToast}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Create New Achievement</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Name</Label><Input value={newAchievement.name} onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })}/></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={newAchievement.description} onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}/></div>
                  <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Icon (Emoji)</Label><Input value={newAchievement.icon} onChange={(e) => setNewAchievement({ ...newAchievement, icon: e.target.value })}/></div><div className="space-y-2"><Label>Points</Label><Input type="number" value={newAchievement.points} onChange={(e) => setNewAchievement({ ...newAchievement, points: parseInt(e.target.value) || 0 })}/></div></div>
                  <Button onClick={handleCreateAchievement} className="w-full"><Plus className="w-4 h-4 mr-2" />Create</Button>
              </CardContent></Card>
              <Card><CardHeader><CardTitle>Existing Achievements</CardTitle></CardHeader><CardContent><div className="space-y-4">{achievements.map((ach) => (<div key={ach.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3"><div className="text-2xl">{ach.icon}</div><div><p className="font-medium">{ach.name}</p><p className="text-sm text-slate-600">{ach.description}</p></div></div>
                  <Badge variant="outline">{ach.points} XP</Badge>
              </div>))}</div></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card><CardHeader><CardTitle>System Settings</CardTitle></CardHeader><CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div><Label className="text-base font-medium">Maintenance Mode</Label><p className="text-sm text-slate-600">Temporarily disable non-admin access.</p></div>
                    <Switch checked={systemSettings.maintenanceMode} onCheckedChange={(checked) => handleUpdateSystemSettings({ maintenanceMode: checked })}/>
                </div>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Send System Notification</CardTitle><CardDescription>Broadcast a message to all users.</CardDescription></CardHeader><CardContent className="space-y-4">
                <div className="space-y-2"><Label>Title</Label><Input value={notification.title} onChange={e => setNotification({...notification, title: e.target.value})} placeholder="e.g., Scheduled Maintenance"/></div>
                <div className="space-y-2"><Label>Message</Label><Textarea value={notification.message} onChange={e => setNotification({...notification, message: e.target.value})} placeholder="e.g., The app will be down for maintenance..."/></div>
                <Button onClick={handleSendNotificationClick} className="w-full"><Bell className="w-4 h-4 mr-2"/>Send Notification</Button>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
