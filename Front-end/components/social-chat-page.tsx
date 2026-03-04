import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Users, User } from "lucide-react";
import { Firestore, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';

interface SocialChatPageProps {
  onBack: () => void;
  speakText: (text: string) => void;
  chatContext: { type: 'group' | 'direct' | 'ai', id: string | null, name: string };
  currentUser: any;
  db: Firestore;
}

interface SocialMessage {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    timestamp: any;
}

export function SocialChatPage({ onBack, speakText, chatContext, currentUser, db }: SocialChatPageProps) {
  const [messages, setMessages] = useState<SocialMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  // This ref is for the scrollable area to automatically scroll to the bottom.
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // When messages change, scroll the referenced element into view.
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (!chatContext.id || !db) return;

    const collectionPath = chatContext.type === 'group' ? 'group_messages' : 'direct_messages';
    const idField = chatContext.type === 'group' ? 'groupId' : 'chatId';

    const messagesCol = collection(db, collectionPath);
    const q = query(messagesCol, where(idField, "==", chatContext.id), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedMessages: SocialMessage[] = [];
        querySnapshot.forEach((doc) => {
            fetchedMessages.push({ id: doc.id, ...doc.data() } as SocialMessage);
        });
        setMessages(fetchedMessages);
    }, (error) => {
        console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [chatContext, db]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chatContext.id || isSending) return;

    setIsSending(true);
    const collectionPath = chatContext.type === 'group' ? 'group_messages' : 'direct_messages';
    const idField = chatContext.type === 'group' ? 'groupId' : 'chatId';

    try {
        await addDoc(collection(db, collectionPath), {
            [idField]: chatContext.id,
            content: inputMessage,
            senderId: currentUser.uid,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatarUrl || '',
            timestamp: serverTimestamp(),
        });
        setInputMessage("");
    } catch (error) {
        console.error("Error sending message:", error);
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
        <Card className="h-[calc(100vh-80px)] flex flex-col max-w-4xl mx-auto shadow-xl">
            <CardHeader className="border-b flex flex-row items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
                    <div className="flex items-center space-x-3">
                        {chatContext.type === 'group' 
                            ? <Users className="w-6 h-6 text-blue-500" /> 
                            : <User className="w-6 h-6 text-teal-500" />}
                        <CardTitle className="dark:text-white text-lg">{chatContext.name}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                {/* FIX: The 'ref' prop is passed directly to ScrollArea. 
                    The component is designed to forward this ref to the underlying scrollable element.
                    The incorrect 'viewportRef' prop has been removed. */}
                <ScrollArea className="h-full p-4">
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-slate-500 dark:text-slate-400 pt-10">
                                No messages yet. Be the first to say something!
                            </div>
                        )}
                        {messages.map((message) => (
                            <div key={message.id} className={`flex gap-3 ${message.senderId === currentUser.uid ? "justify-end" : "justify-start"}`}>
                                {message.senderId !== currentUser.uid && (
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                                        <AvatarFallback>{message.senderName ? message.senderName.charAt(0) : 'U'}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`rounded-lg p-3 max-w-[85%] sm:max-w-[75%] cursor-pointer transition-colors duration-200 ${message.senderId === currentUser.uid ? "bg-yellow-500 text-slate-900 rounded-br-none" : "bg-slate-100 dark:bg-slate-800 rounded-bl-none"}`} onClick={() => speakText(message.content)}>
                                    {message.senderId !== currentUser.uid && <p className="text-xs font-bold mb-1 text-blue-600 dark:text-blue-400">{message.senderName}</p>}
                                    <p className="font-medium text-base whitespace-pre-wrap">{message.content}</p>
                                </div>
                                {message.senderId === currentUser.uid && (
                                     <Avatar className="w-8 h-8">
                                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                                        <AvatarFallback className="bg-yellow-500 text-slate-900">{currentUser.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                     {/* This empty div is the target for the scroll-to-bottom ref */}
                    <div ref={scrollAreaRef} />
                </ScrollArea>
            </CardContent>
            <div className="border-t p-4 bg-white dark:bg-slate-950">
                <div className="flex items-center space-x-2">
                    <Input 
                        value={inputMessage} 
                        onChange={(e) => setInputMessage(e.target.value)} 
                        placeholder={`Message ${chatContext.name}`} 
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} 
                        className="flex-1"
                        disabled={isSending}
                    />
                    <Button onClick={handleSendMessage} disabled={isSending || !inputMessage.trim()} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 disabled:bg-slate-300">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    </div>
  );
}
