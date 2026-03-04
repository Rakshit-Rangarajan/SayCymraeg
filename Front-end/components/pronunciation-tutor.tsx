import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Volume2, Loader2, Mic, CheckCircle, XCircle, RotateCcw, Target, ArrowLeft } from "lucide-react";

// FIX: Removed speakText from props to make the component self-contained.
interface PronunciationTutorProps {
  onBack: () => void;
  userLevel: string;
}

interface WordData {
  welsh: string;
  english: string;
  pronunciation: string;
}

// Web Audio API hook for voice activity detection
const useVoiceActivity = (onStop: () => void) => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        sourceRef.current?.disconnect();
        processorRef.current?.disconnect();
        audioContextRef.current?.close().catch(e => console.error("Error closing AudioContext:", e));
    }, []);

    const startRecording = async (onDataAvailable: (blob: Blob) => void) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if(event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
                onDataAvailable(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();

            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            processorRef.current = audioContextRef.current.createScriptProcessor(2048, 1, 1);

            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(processorRef.current);
            processorRef.current.connect(audioContextRef.current.destination);

            processorRef.current.onaudioprocess = (e) => {
                const buffer = e.inputBuffer.getChannelData(0);
                const rms = Math.sqrt(buffer.reduce((acc, val) => acc + val * val, 0) / buffer.length);
                
                if (rms > 0.01) {
                    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
                    silenceTimeoutRef.current = null;
                } else {
                    if (!silenceTimeoutRef.current) {
                        silenceTimeoutRef.current = setTimeout(() => {
                           stopRecording();
                           onStop();
                        }, 1500);
                    }
                }
            };
        } catch(err) {
            console.error("Error starting recording:", err);
            // Handle permissions error etc.
        }
    };

    return { startRecording, stopRecording };
};


export function PronunciationTutor({ onBack, userLevel }: PronunciationTutorProps) {
  const [words, setWords] = useState<WordData[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ score: number; transcribedText: string; error?: string } | null>(null);
  
  // --- FIX START: Self-contained text-to-speech logic ---
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const speakText = async (text: string, lang: string = 'cy') => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (!text) return;

    try {
      const response = await fetch('http://localhost:5001/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });
      if (!response.ok) throw new Error(`API request failed`);
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      setAudio(newAudio);
      newAudio.play();
    } catch (error) {
      console.error("Error in speakText function:", error);
    }
  };
  // --- FIX END ---

  const handleRecordingStop = useCallback(() => {
      setIsRecording(false);
      setIsAnalyzing(true);
  }, []);

  const { startRecording, stopRecording } = useVoiceActivity(handleRecordingStop);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/get-practice-words?level=${userLevel}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setWords(data);
      } catch (error) { console.error("Failed to fetch practice words:", error); } 
      finally { setLoading(false); }
    };
    fetchWords();
  }, [userLevel]);

  const handleSendAudio = async (audioBlob: Blob) => {
    if (!words[currentWordIndex] || audioBlob.size === 0) {
        setIsAnalyzing(false);
        setAnalysisResult({ score: 0, transcribedText: "", error: "No audio was recorded." });
        return;
    };
    
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('targetText', words[currentWordIndex].welsh);

    try {
        const response = await fetch('http://localhost:5001/api/analyze-speech', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        setAnalysisResult(result);
    } catch (error) {
        console.error("Error analyzing speech:", error);
        setAnalysisResult({ score: 0, transcribedText: "Error analyzing.", error: "Could not reach server." });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setAnalysisResult(null);
    setIsRecording(true);
    await startRecording(handleSendAudio);
  };

  const handleStop = () => {
      stopRecording();
  };

  const handleNextWord = () => {
      if(currentWordIndex < words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setAnalysisResult(null);
      } else {
          onBack();
      }
  }

  const currentWord = words[currentWordIndex];
  const score = analysisResult ? Math.round(analysisResult.score) : 0;
  const feedbackColorClass = score >= 75 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500';
  const progressColorClass = score >= 75 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
       <Card className="w-full max-w-md relative">
        <CardHeader>
          <Button variant="ghost" size="icon" onClick={onBack} className="absolute top-4 left-4"><ArrowLeft className="w-5 h-5" /></Button>
          <CardTitle className="text-2xl text-center pt-2">Pronunciation Tutor</CardTitle>
          <CardDescription className="text-center">Listen to the word, then say it clearly.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <div className="h-64 flex justify-center items-center"><Loader2 className="w-12 h-12 animate-spin text-yellow-500" /></div> : currentWord ? (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-5xl font-bold text-yellow-500">{currentWord.welsh}</h2>
                <p className="text-xl text-slate-600 dark:text-slate-300">{currentWord.english}</p>
                <p className="text-md text-slate-500 dark:text-slate-400 font-mono mt-1">[{currentWord.pronunciation}]</p>
              </div>

              <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={() => speakText(currentWord.welsh)} disabled={isRecording}><Volume2 className="w-5 h-5 mr-2" />Listen</Button>
                  <Button onClick={isRecording ? handleStop : handleStart} className={`${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'} text-white w-32`}>
                      <Mic className="w-5 h-5 mr-2" />
                      {isRecording ? 'Listening...' : 'Speak'}
                  </Button>
              </div>

              <div className="h-24 flex flex-col justify-center items-center">
                {isAnalyzing && <div className="flex items-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mr-2"/>Analyzing...</div>}
                
                {analysisResult && (
                  <div className="w-full space-y-3 animate-in fade-in">
                      <div className={`flex items-center justify-center space-x-2 ${feedbackColorClass}`}>
                          {score >= 75 ? <CheckCircle /> : <XCircle />}
                          <p className="text-lg font-bold">Score: {score}%</p>
                      </div>
                      <Progress value={score} className={progressColorClass} />
                      {analysisResult.transcribedText && analysisResult.transcribedText !== "..." && <p className="text-sm text-slate-500">We heard: "{analysisResult.transcribedText}"</p>}
                      {analysisResult.error && <p className="text-sm text-red-500">{analysisResult.error}</p>}
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleStart} disabled={isRecording || isAnalyzing}><RotateCcw className="w-4 h-4 mr-2"/>Try Again</Button>
                  <Button onClick={handleNextWord} disabled={isRecording || isAnalyzing} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"><Target className="w-4 h-4 mr-2"/>Next Word</Button>
              </div>
            </div>
          ) : <p className="text-center text-slate-500">Could not load words for this level.</p>}
        </CardContent>
      </Card>
    </div>
  );
}