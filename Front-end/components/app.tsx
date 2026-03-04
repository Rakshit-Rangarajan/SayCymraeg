import React, { useState, useEffect, useCallback } from 'react';

// Import all your page components
import { Dashboard } from './dashboard';
import { ChatPage } from './chat-page';
import { SocialChatPage } from './social-chat-page';
import { LearnPage } from './learn-page';
import { PronunciationTutor } from './pronunciation-tutor';
import { FlashcardTopicsPage } from './flashcard-topics-page';
import { FlashcardsPage } from './flashcards-page';
import { CreateCustomTopicPage } from './create-custom-topic-page';
import { AuthPage } from './auth-page';
import { OnboardingPage } from './onboarding-page';
import { NavBar } from './nav-bar';
import { StatsPage } from './stats-page';
import { SettingsPage } from './settings-page';
import { ProfilePage } from './profile-page';
import { AccountPage } from './account-page';
import { SocialPage } from './social-page';
import { LevelUpCelebration } from './LevelUpCelebration';
import { Level } from './levelingSystem';

// Import Firebase services
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot, collection, getDocs, writeBatch, deleteDoc, serverTimestamp, query, where, arrayUnion, arrayRemove, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Toast Notification Component
const Toast = ({ message, type, onDismiss }: any) => (
    <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg flex items-center space-x-3 z-[100] animate-in slide-in-from-top ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
        {type === 'success' ? <CheckCircle/> : <XCircle/>}
        <span>{message}</span>
        <Button variant="ghost" size="icon" onClick={onDismiss} className="h-6 w-6 hover:bg-white/20"><XCircle className="w-4 h-4"/></Button>
    </div>
);

// Firebase Configuration using environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// IMPROVEMENT: Use an environment variable for the API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface UserProfile {
    uid: string; name: string; email: string; bio: string; avatarUrl: string; level: Level; streak: number; hasCompletedOnboarding: boolean; learnedWords: any[]; favoritedTopics: string[]; friends: string[]; isAdmin: boolean;
}
interface Topic { id: string; name: string; difficulty: string; }
const defaultUserProfile = { name: 'New Learner', email: '', bio: '', avatarUrl: '', level: { hierarchy: 'Beginner', level: 1, points: 0 }, streak: 0, hasCompletedOnboarding: false, learnedWords: [], friends: [], isAdmin: false, favoritedTopics: [] };


export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [language] = useState('Welsh');
  const [darkMode, setDarkMode] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<Level | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [chatContext, setChatContext] = useState<{ type: 'group' | 'direct' | 'ai', id: string | null, name: string } | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => { setToast({ message, type }); };
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 5000); return () => clearTimeout(timer); } }, [toast]);

  // --- AUTH & USER PROFILE LISTENERS ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) { 
          setUserProfile(null); setLoading(false); setCurrentScreen('auth');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) { 
            const profileData = docSnap.data();
            // Ensure default level object exists if missing from Firestore
            if (!profileData.level) {
                profileData.level = { hierarchy: 'Beginner', level: 1, points: 0 };
            }
            setUserProfile({ ...profileData, uid: user.uid } as UserProfile); 
        }
        setLoading(false);
      });
      return () => unsubscribeUser();
    } else {
        setLoading(false);
    }
  }, [user?.uid]);
  
  // --- SOCIAL & NOTIFICATION DATA LISTENERS ---
  useEffect(() => {
    if (!user?.uid) return;

    const usersUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => { setAllUsers(snapshot.docs.map(doc => ({...doc.data(), uid: doc.id }))); });
    const groupsUnsubscribe = onSnapshot(collection(db, "groups"), (snapshot) => { setGroups(snapshot.docs.map(doc => ({...doc.data(), id: doc.id }))); });
    
    const incomingRequestsQuery = query(collection(db, "friendRequests"), where("recipientId", "==", user.uid), where("status", "==", "pending"));
    const incomingUnsubscribe = onSnapshot(incomingRequestsQuery, (snapshot) => { setFriendRequests(snapshot.docs.map(doc => ({...doc.data(), id: doc.id }))); });
    
    const sentRequestsQuery = query(collection(db, "friendRequests"), where("senderId", "==", user.uid), where("status", "==", "pending"));
    const sentUnsubscribe = onSnapshot(sentRequestsQuery, (snapshot) => { setSentRequests(snapshot.docs.map(doc => ({...doc.data(), id: doc.id }))); });

    const notificationsQuery = query(collection(db, "notifications"), where("recipientId", "==", user.uid));
    const notificationsUnsubscribe = onSnapshot(notificationsQuery, (snapshot) => { setNotifications(snapshot.docs.map(doc => ({...doc.data(), id: doc.id }))); });

    return () => {
      usersUnsubscribe();
      groupsUnsubscribe();
      incomingUnsubscribe();
      sentUnsubscribe();
      notificationsUnsubscribe();
    }
  }, [user?.uid]);
  
  // --- CORE DATA FETCHING ---
  const fetchTopics = useCallback(async () => {
    if (!userProfile?.level?.hierarchy || !user?.uid) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/topics?language=${language}&level=${userProfile.level.hierarchy}&userId=${user.uid}`);
        if (!response.ok) throw new Error("Failed to fetch topics");
        setTopics(await response.json());
    } catch (error) {
        console.error(error);
        showToast("Could not load topics.", "error");
    }
  }, [userProfile?.level?.hierarchy, user?.uid, language]);

  // IMPROVEMENT: Fetch topics when the user profile is loaded/updated.
  useEffect(() => {
    if (userProfile) {
        fetchTopics();
    }
  }, [userProfile, fetchTopics]);

  const handleNavigation = (screen: string) => setCurrentScreen(screen);
  const handleLogout = async () => { await signOut(auth); };
  const handleChatNavigate = (type: 'group' | 'direct' | 'ai', id: string | null, name: string) => { setChatContext({ type, id, name }); setCurrentScreen('social-chat'); };
  const handleToggleDarkMode = () => setDarkMode(prev => !prev);

  const handleMarkNotificationsAsRead = async () => {
    if (!user || notifications.length === 0) return;
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    const batch = writeBatch(db);
    unreadNotifications.forEach(notif => {
        const notifRef = doc(db, "notifications", notif.id);
        batch.update(notifRef, { isRead: true });
    });
    try {
        await batch.commit();
    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
    }
  };

  // --- API HANDLERS ---
  const speakText = async (text: string) => {
    if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
    if (!text) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/speak`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang: 'cy' }),
        });
        if (!response.ok) throw new Error('Failed to fetch audio');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const newAudio = new Audio(url);
        setAudio(newAudio);
        newAudio.play();
    } catch (error) {
        console.error("Error in speakText function:", error);
        showToast("Text-to-speech service is unavailable.", "error");
    }
  };

  const handleTopicSelect = async (topic: any) => {
    setSelectedTopic(topic);
    try {
        const response = await fetch(`${API_BASE_URL}/api/flashcards?language=${language}&level=${topic.difficulty}&topicId=${topic.id}`);
        if (!response.ok) throw new Error("Failed to fetch flashcards");
        setFlashcards(await response.json());
        setCurrentScreen('flashcards-page');
    } catch (error) {
        console.error(error);
        showToast("Could not load flashcards.", "error");
    }
  };
  
  const handleUpdateProfile = async (details: { name?: string, bio?: string }, avatarFile?: File) => {
    if (!user) return;
    showToast("Updating...", "success");
    const userDocRef = doc(db, 'users', user.uid);
    let updatedData: { [key: string]: any } = { ...details };
    try {
        if (avatarFile) {
            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(storageRef, avatarFile);
            updatedData.avatarUrl = await getDownloadURL(storageRef);
        }
        await updateDoc(userDocRef, updatedData);
        showToast("Profile updated!", "success");
    } catch (error) {
        console.error(error);
        showToast("Failed to update profile.", "error");
    }
  };
  
  const handleToggleFavorite = async (topicId: string) => {
    if (!user) return;
    try {
        await fetch(`${API_BASE_URL}/api/user/toggle-favorite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid, topicId }),
        });
    } catch (error) {
        console.error(error);
        showToast("Could not update favorites.", "error");
    }
  };

  const handleDeleteTopic = async (topic: Topic) => {
    if (!user) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/topics/${language}/${topic.difficulty}/${topic.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid }),
        });
        if (!response.ok) {
            throw new Error((await response.json()).error || "Failed to delete");
        }
        showToast("Topic deleted.", "success");
        await fetchTopics();
    } catch (error: any) {
        console.error(error);
        showToast(error.message, "error");
    }
  };

  const handleLearnedWord = async (word: any, topicId: string) => {
    if (!user) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/learned-word`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid, word, points: 50, topicId, language }),
        });
        if (!response.ok) throw new Error("Server error");
        const result = await response.json();
        if (result.levelUpInfo) {
            setLevelUpInfo(result.levelUpInfo);
        }
    } catch (error) {
        console.error(error);
        showToast("Could not save progress.", "error");
    }
  };

  const handleCreateCustomTopic = async (data: { title?: string; description: string; level: string; numFlashcards: number; }) => {
    if (!user) return;
    showToast("Generating your new topic...", "success");
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, userId: user.uid, language }),
        });
        if (!response.ok) {
            throw new Error((await response.json()).error || "Failed to create topic");
        }
        showToast("New topic created!", "success");
        await fetchTopics();
        handleNavigation('flashcard-topics');
    } catch (error: any) {
        console.error(error);
        showToast(error.message, "error");
    }
  };
  
  // --- AUTH HANDLERS ---
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
            const newProfile = { ...defaultUserProfile, uid: user.uid, email: user.email || '', name: user.displayName || 'New Learner', avatarUrl: user.photoURL || '' };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile as UserProfile);
        }
    } catch (error: any) {
        setAuthError(error.message);
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const newProfile = { ...defaultUserProfile, uid: cred.user.uid, email: cred.user.email || '', name: email.split('@')[0] };
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        setUserProfile(newProfile as UserProfile);
    } catch (error: any) {
        setAuthError(error.message);
    }
  };
  
  const handleLogin = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        setAuthError(null);
    } catch (error: any) {
        setAuthError(error.message);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (user) {
        await updateDoc(doc(db, 'users', user.uid), { hasCompletedOnboarding: true });
        setCurrentScreen('dashboard');
    }
  };

  // --- SOCIAL ACTION HANDLERS ---
  const onSendFriendRequest = async (recipientId: string) => { if (!user || !userProfile) return; try { await addDoc(collection(db, "friendRequests"), { senderId: user.uid, senderName: userProfile.name, senderAvatar: userProfile.avatarUrl, recipientId: recipientId, status: 'pending', createdAt: serverTimestamp(), }); showToast("Friend request sent!", "success"); } catch (error) { console.error(error); showToast("Failed to send request.", "error"); } };
  const onAcceptFriendRequest = async (request: any) => { if (!user) return; const batch = writeBatch(db); batch.update(doc(db, "users", user.uid), { friends: arrayUnion(request.senderId) }); batch.update(doc(db, "users", request.senderId), { friends: arrayUnion(user.uid) }); batch.delete(doc(db, "friendRequests", request.id)); try { await batch.commit(); showToast("Friend added!", "success"); } catch (error) { console.error(error); showToast("Failed to add friend.", "error"); } };
  const onRejectFriendRequest = async (requestId: string) => { try { await deleteDoc(doc(db, "friendRequests", requestId)); showToast("Request rejected.", "success"); } catch (error) { console.error(error); showToast("Failed to reject request.", "error"); } };
  const onCreateGroup = async (groupData: { name: string; description: string; }) => { if (!user || !userProfile) return; try { await addDoc(collection(db, "groups"), { ...groupData, createdBy: user.uid, creatorName: userProfile.name, createdAt: serverTimestamp(), members: { [user.uid]: true }, isAdminOnly: false, }); showToast("Group created!", "success"); } catch (error) { console.error(error); showToast("Failed to create group.", "error"); } };
  const onJoinGroup = async (groupId: string) => { if (!user) return; try { await updateDoc(doc(db, "groups", groupId), { [`members.${user.uid}`]: true }); showToast("Joined group!", "success"); } catch (error) { console.error(error); showToast("Failed to join group.", "error"); } };

  // --- SCREEN RENDER LOGIC ---
  const renderScreen = () => {
    if (!userProfile) {
        return <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white"><Loader2 className="w-8 h-8 animate-spin"/></div>;
    }
    
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard userLevel={userProfile.level} userStreak={userProfile.streak} dailyProgress={65} topics={topics} onNavigate={handleNavigation} onTopicSelect={handleTopicSelect} speakText={speakText} />;
      case 'learn':
        return <LearnPage onNavigate={handleNavigation} />;
      case 'pronunciation-tutor':
        return <PronunciationTutor onBack={() => handleNavigation('learn')} userLevel={userProfile.level.hierarchy} />;
      case 'flashcard-topics':
        return <FlashcardTopicsPage onBack={() => handleNavigation('learn')} topics={topics} onTopicSelect={handleTopicSelect} userProfile={userProfile} onNavigate={handleNavigation} onDeleteTopic={handleDeleteTopic} onToggleFavorite={handleToggleFavorite} />;
      case 'flashcards-page':
        return <FlashcardsPage onBack={() => handleNavigation('flashcard-topics')} flashcards={flashcards} topic={selectedTopic} onLearnedWord={(word) => handleLearnedWord(word, selectedTopic.id)} learnedWords={userProfile.learnedWords || []} />;
      case 'create-custom-topic':
        return <CreateCustomTopicPage onBack={() => handleNavigation('flashcard-topics')} onCreateTopic={handleCreateCustomTopic} userProfile={userProfile} />;
      case 'chat':
        return <ChatPage onBack={() => handleNavigation('dashboard')} currentUser={userProfile} />;
      case 'social-chat':
        if (chatContext) {
          return <SocialChatPage onBack={() => handleNavigation('social')} speakText={speakText} chatContext={chatContext} currentUser={userProfile} db={db} />;
        }
        return null;
      case 'stats':
        return <StatsPage onBack={() => handleNavigation('dashboard')} userProfile={userProfile} topics={topics} />;
      case 'settings':
        // FIX: Pass missing darkMode and onToggleDarkMode props
        return <SettingsPage onBack={() => handleNavigation('dashboard')} onNavigate={handleNavigation} isAdmin={userProfile.isAdmin || false} darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />;
      case 'profile':
        return <ProfilePage onBack={() => handleNavigation('dashboard')} userProfile={userProfile} achievements={[]} onNavigate={handleNavigation} />;
      case 'account':
        return <AccountPage onBack={() => handleNavigation('settings')} userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />;
      case 'social':
        return <SocialPage 
                    onBack={() => handleNavigation('dashboard')} 
                    onNavigate={handleNavigation} 
                    onChatNavigate={handleChatNavigate}
                    allUsers={allUsers}
                    currentUser={userProfile}
                    groups={groups}
                    onCreateGroup={onCreateGroup}
                    onJoinGroup={onJoinGroup}
                    friendRequests={friendRequests}
                    sentRequests={sentRequests}
                    onSendFriendRequest={onSendFriendRequest}
                    onAcceptFriendRequest={onAcceptFriendRequest}
                    onRejectFriendRequest={onRejectFriendRequest}
                  />;
      default:
        return <Dashboard userLevel={userProfile.level} userStreak={userProfile.streak} dailyProgress={65} topics={topics} onNavigate={handleNavigation} onTopicSelect={handleTopicSelect} speakText={speakText}/>;
    }
  };

  if (loading) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white"><Loader2 className="w-8 h-8 animate-spin"/></div>;
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} onGoogleSignIn={handleGoogleSignIn} error={authError} />;
  }

  if (userProfile && !userProfile.hasCompletedOnboarding) {
    // FIX: Pass missing onboardingStep and setOnboardingStep props
    return <OnboardingPage onComplete={handleCompleteOnboarding} onboardingStep={onboardingStep} setOnboardingStep={setOnboardingStep} />;
  }

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 ${darkMode ? 'dark' : ''}`}>
        {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
        {levelUpInfo && <LevelUpCelebration newLevel={levelUpInfo} onComplete={() => setLevelUpInfo(null)} />}
        {/* FIX: Pass missing notifications and handler props to NavBar */}
        <NavBar userProfile={userProfile} onNavigate={handleNavigation} onLogout={handleLogout} notifications={notifications} onMarkNotificationsAsRead={handleMarkNotificationsAsRead} />
        <main className="pt-16">
            {renderScreen()}
        </main>
    </div>
  );
}