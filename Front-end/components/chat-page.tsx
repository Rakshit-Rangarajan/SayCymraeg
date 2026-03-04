import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, ArrowLeft, Volume2 } from "lucide-react";

// FIX: Removed speakText from the props, as it will now be handled internally.
interface ChatPageProps {
  onBack: () => void;
  currentUser: any;
}

interface Message {
    id: string;
    type: 'bot' | 'user';
    content: string;
    translation?: string;
    timestamp: any;
}

export function ChatPage({ onBack, currentUser }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem('autoSpeakEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // --- FIX START: Self-contained text-to-speech logic ---
  // State to manage the audio object
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // The entire speakText function is now defined directly inside this component.
  const speakText = async (text: string, lang: string = 'cy') => {
    // If different audio is already playing, stop it first.
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (!text) return; // Don't try to speak empty text

    try {
      const response = await fetch('http://localhost:5001/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      setAudio(newAudio); // Save the new audio object to state
      newAudio.play();
    } catch (error) {
      console.error("Error in speakText function:", error);
    }
  };
  // --- FIX END ---


  useEffect(() => {
    localStorage.setItem('autoSpeakEnabled', JSON.stringify(autoSpeak));
  }, [autoSpeak]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);
  
  useEffect(() => {
    const initialMessage: Message = { 
        id: 'initial-ai', 
        type: 'bot', 
        content: 'Helo! Sut alla i eich helpu i ymarfer Cymraeg heddiw?', 
        translation: 'Hello! How can I help you practice Welsh today?',
        timestamp: new Date() 
    };
    
    setMessages([initialMessage]);

    if (autoSpeak) {
        speakText(initialMessage.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessageContent = inputMessage;
    setInputMessage("");

    const userMessage: Message = { 
        id: Date.now().toString(), 
        type: "user", 
        content: userMessageContent, 
        timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
        const response = await fetch('http://localhost:5001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessageContent })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const botResponse = await response.json();
        
        const botMessage: Message = { 
            id: (Date.now() + 1).toString(), 
            type: "bot", 
            content: botResponse.welsh, 
            translation: botResponse.english, 
            timestamp: new Date() 
        };
        
        setMessages((prev) => [...prev, botMessage]);

        if (autoSpeak && botResponse.welsh) {
            speakText(botResponse.welsh);
        }

    } catch (error) {
        console.error("Failed to get response from AI Tutor:", error);
        const errorMessage: Message = { 
            id: (Date.now() + 1).toString(), 
            type: 'bot', 
            content: "Mae'n ddrwg gen i, rwy'n cael trafferth cysylltu.",
            translation: "I'm sorry, I'm having trouble connecting.",
            timestamp: new Date() 
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
     <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
        <Card className="h-[calc(100vh-80px)] flex flex-col max-w-4xl mx-auto shadow-xl">
            <CardHeader className="border-b flex flex-row items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
                    <div className="flex items-center space-x-3">
                        <Bot className="w-6 h-6 text-green-500" />
                        <CardTitle className="dark:text-white text-lg">AI Welsh Tutor</CardTitle>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="auto-speak-toggle" className="dark:text-white text-sm font-medium">Auto-Speak</Label>
                    <Switch id="auto-speak-toggle" checked={autoSpeak} onCheckedChange={setAutoSpeak} />
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-6">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex items-end gap-2 ${message.type === 'user' ? "justify-end" : "justify-start"}`}>
                                <div className={`flex items-center gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <Avatar className="w-8 h-8 shrink-0">
                                        <AvatarFallback className={message.type === 'user' ? "bg-yellow-500 text-slate-900" : "bg-green-500 text-white"}>
                                            {message.type === 'user' ? (currentUser.name?.charAt(0) || 'U') : 'AI'}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className={`rounded-lg p-3 max-w-[70%] sm:max-w-[65%] transition-colors duration-200 ${message.type === 'user' ? "bg-yellow-500 text-slate-900 rounded-br-none" : "bg-slate-100 dark:bg-slate-800 rounded-bl-none"}`}>
                                        <p className="font-medium text-base">{message.content}</p>
                                        {message.translation && <p className="text-sm opacity-80 mt-1 italic">({message.translation})</p>}
                                    </div>
                                    
                                    <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0" onClick={() => speakText(message.content)}>
                                        <Volume2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start items-center gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-green-500 text-white">AI</AvatarFallback>
                                </Avatar>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div ref={scrollAreaRef} />
                </ScrollArea>
            </CardContent>
            <div className="border-t p-4 bg-white dark:bg-slate-950">
                <div className="flex items-center space-x-2">
                    <Input 
                        value={inputMessage} 
                        onChange={(e) => setInputMessage(e.target.value)} 
                        placeholder="Type a message in Welsh or English..." 
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} 
                        className="flex-1" 
                        disabled={isTyping}
                    />
                    <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 disabled:bg-slate-300">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    </div>
  );
}