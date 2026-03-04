import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, BookOpen, Languages, Trophy, BarChart3, Users, Settings, Bell, User, LogOut, AlertTriangle } from "lucide-react";

interface NavBarProps {
    userProfile: any;
    notifications: any[];
    onNavigate: (screen: string) => void;
    onLogout: () => void;
    onMarkNotificationsAsRead: () => void;
}

export function NavBar({ userProfile, notifications = [], onNavigate, onLogout, onMarkNotificationsAsRead }: NavBarProps) {
    const unreadCount = notifications.length;

    const getNotificationIcon = (title: string) => {
        if (title.toLowerCase().includes('maintenance')) {
            return <AlertTriangle className="w-4 h-4 text-yellow-400 mr-3 flex-shrink-0" />;
        }
        return <Bell className="w-4 h-4 text-blue-400 mr-3 flex-shrink-0" />;
    };

    return (
        <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => onNavigate("dashboard")}>
                        <Languages className="w-8 h-8 text-yellow-500 mr-2" />
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">SayCymraeg</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <Button variant="ghost" onClick={() => onNavigate("dashboard")}><Home className="w-4 h-4 mr-2" />Home</Button>
                        <Button variant="ghost" onClick={() => onNavigate("learn")}><BookOpen className="w-4 h-4 mr-2" />Learn</Button>
                        <Button variant="ghost" onClick={() => onNavigate("chat")}><Languages className="w-4 h-4 mr-2" />AI Chat</Button>
                        <Button variant="ghost" onClick={() => onNavigate("leaderboard")}><Trophy className="w-4 h-4 mr-2" />Compete</Button>
                        <Button variant="ghost" onClick={() => onNavigate("stats")}><BarChart3 className="w-4 h-4 mr-2" />Stats</Button>
                        <Button variant="ghost" onClick={() => onNavigate("social")}><Users className="w-4 h-4 mr-2" />Social</Button>
                    </div>

                    <div className="flex items-center space-x-4">
                         {userProfile?.level && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700">{userProfile.level.hierarchy} {userProfile.level.level}</Badge>}
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                            {unreadCount}
                                        </div>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {notifications.length > 0 ? (
                                    notifications.slice(0, 5).map((notif: any) => (
                                        <DropdownMenuItem key={notif.id} onSelect={(e) => e.preventDefault()} className="flex items-start p-2">
                                            {getNotificationIcon(notif.title)}
                                            <div className="flex-1">
                                                <p className="font-semibold">{notif.title}</p>
                                                <p className="text-sm text-slate-500 whitespace-normal">{notif.message}</p>
                                            </div>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <p className="p-4 text-sm text-slate-500">No new notifications.</p>
                                )}
                                {unreadCount > 0 && (
                                     <DropdownMenuItem onSelect={onMarkNotificationsAsRead} className="justify-center text-blue-500 cursor-pointer hover:!bg-blue-50 dark:hover:!bg-blue-900/50">
                                        Mark all as read
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="w-9 h-9 cursor-pointer">
                                    <AvatarImage src={userProfile?.avatarUrl || `https://i.pravatar.cc/150?u=${userProfile?.email}`} />
                                    <AvatarFallback>{userProfile?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{userProfile?.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onNavigate("profile")}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onNavigate("settings")}><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                                  <LogOut className="mr-2 h-4 w-4" />Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
