import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  MessageCircle,
  Trophy,
  Search,
  PlusCircle,
  UserCheck,
  Check,
  X,
  Send,
} from "lucide-react";

interface SocialPageProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onChatNavigate: (type: 'ai' | 'group' | 'direct', id: string | null, name: string) => void;
  allUsers: any[];
  currentUser: any;
  groups: any[];
  onCreateGroup: (groupData: { name: string; description: string; }) => void;
  onJoinGroup: (groupId: string) => void;
  friendRequests: any[];
  sentRequests: any[];
  onSendFriendRequest: (recipientId: string) => void;
  onAcceptFriendRequest: (request: any) => void;
  onRejectFriendRequest: (requestId: string) => void;
}

export function SocialPage({ 
    onBack, 
    onNavigate, 
    onChatNavigate, 
    allUsers, 
    currentUser, 
    groups, 
    onCreateGroup, 
    onJoinGroup, 
    friendRequests,
    sentRequests,
    onSendFriendRequest,
    onAcceptFriendRequest,
    onRejectFriendRequest
}: SocialPageProps) {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  // Use default empty arrays to prevent crashes if props are not ready.
  const friendUIDs = currentUser?.friends || [];
  const sentRequestRecipientIds = (sentRequests || []).map(req => req.recipientId);
  
  const friends = (allUsers || []).filter(user => friendUIDs.includes(user.uid));
  
  const suggestedUsers = (allUsers || []).filter(user => user.uid !== currentUser?.uid && !friendUIDs.includes(user.uid));
  
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const visibleGroups = currentUser?.isAdmin ? (groups || []) : (groups || []).filter(g => !g.isAdminOnly);

  const handleCreateGroupSubmit = () => {
    if (newGroupName.trim() && newGroupDesc.trim()) {
        onCreateGroup({ name: newGroupName, description: newGroupDesc });
        setNewGroupName("");
        setNewGroupDesc("");
    }
  };

  const getUserInteractionButton = (user: any) => {
    if (friendUIDs.includes(user.uid)) {
        return <Badge variant="secondary"><UserCheck className="w-4 h-4 mr-2" />Friends</Badge>;
    }
    if (sentRequestRecipientIds.includes(user.uid)) {
        return <Button size="sm" disabled><Send className="w-4 h-4 mr-2" />Request Sent</Button>;
    }
    return (
        <Button size="sm" onClick={() => onSendFriendRequest(user.uid)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
        </Button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="discover">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="mt-6 space-y-6">
            {(friendRequests || []).length > 0 && (
                <Card>
                    <CardHeader><CardTitle className='dark:text-white'>Friend Requests</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {(friendRequests || []).map(request => (
                            <div key={request.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="w-10 h-10"><AvatarImage src={request.senderAvatar}/><AvatarFallback>{request.senderName?.charAt(0)}</AvatarFallback></Avatar>
                                    <p className="font-semibold text-slate-800 dark:text-white">{request.senderName}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="icon" className="bg-green-500 hover:bg-green-600" onClick={() => onAcceptFriendRequest(request)}><Check className="w-4 h-4"/></Button>
                                    <Button size="icon" variant="destructive" onClick={() => onRejectFriendRequest(request.id)}><X className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
            <Card>
              <CardHeader><CardTitle className='dark:text-white'>Suggested Learners</CardTitle><CardDescription>Connect with other people on their Welsh learning journey.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map(user => (
                  <div key={user.uid} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-10 h-10"><AvatarImage src={user.avatarUrl || "/placeholder.svg"} /><AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback></Avatar>
                      <div><p className="font-semibold text-slate-800 dark:text-white">{user.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">{user.level?.hierarchy}</p></div>
                    </div>
                    {getUserInteractionButton(user)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="mt-6 space-y-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search friends..." className="pl-10 w-full md:w-1/3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFriends.length > 0 ? filteredFriends.map((friend) => (
                <Card key={friend.uid} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-12 h-12"><AvatarImage src={friend.avatarUrl || "/placeholder.svg"} /><AvatarFallback>{friend.name ? friend.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback></Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 dark:text-white">{friend.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{friend.level?.hierarchy} {friend.level?.level}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-transparent" 
                        onClick={() => {
                          // --- THIS IS THE FIX ---
                          // Create a consistent, combined, and sorted ID for the direct chat
                          const chatId = [currentUser.uid, friend.uid].sort().join('_');
                          onChatNavigate('direct', chatId, `Chat with ${friend.name}`);
                        }}>
                          <MessageCircle className="w-4 h-4 mr-1" />Chat
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onNavigate('quiz')}><Trophy className="w-4 h-4 mr-1" />Challenge</Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-slate-500 dark:text-slate-400 col-span-full text-center">You haven't added any friends yet. Go to the Discover tab to find learners!</p>
              )}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="mt-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {visibleGroups.map(group => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className='dark:text-white'>{group.name}</CardTitle>
                        <Badge variant="secondary">{group.members?.length || 0} members</Badge>
                      </div>
                      {group.isAdminOnly && <Badge variant="destructive">Admins Only</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{group.description}</p>
                    <div className="flex space-x-2">
                        {group.members?.includes(currentUser.uid) ? (
                            <Button onClick={() => onChatNavigate('group', group.id, group.name)} className="bg-blue-500 hover:bg-blue-600 text-white"><MessageCircle className="w-4 h-4 mr-2" />Open Chat</Button>
                        ) : (
                            <Button onClick={() => onJoinGroup(group.id)} className="bg-green-500 hover:bg-green-600 text-white"><Users className="w-4 h-4 mr-2" />Join Group</Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader><CardTitle className='dark:text-white'>Create a New Group</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name" className="dark:text-white">Group Name</Label>
                    <Input id="group-name" placeholder="e.g., Welsh for Beginners" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-desc" className="dark:text-white">Description</Label>
                    <Textarea id="group-desc" placeholder="What is this group about?" value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} />
                  </div>
                  <Button onClick={handleCreateGroupSubmit} className="w-full"><PlusCircle className="w-4 h-4 mr-2" />Create Group</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}