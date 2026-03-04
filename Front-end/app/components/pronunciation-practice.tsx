"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Volume2, RotateCcw, CheckCircle, XCircle, Target, TrendingUp } from "lucide-react"

interface PronunciationPracticeProps {
  word: {
    english: string
    welsh: string
    phonetic: string
    difficulty: string
  }
  isListening: boolean
  feedback: {
    word: string
    score: number
    feedback: string
    isCorrect: boolean
  } | null
  onStartRecording: () => void
  onPlayAudio: () => void
  onNextWord: () => void
  onRetry: () => void
}

export function PronunciationPractice({
  word,
  isListening,
  feedback,
  onStartRecording,
  onPlayAudio,
  onNextWord,
  onRetry,
}: PronunciationPracticeProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Word Card */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">{word.welsh}</CardTitle>
          <CardDescription className="text-lg text-slate-600 dark:text-slate-300">{word.english}</CardDescription>
          <div className="text-slate-500 dark:text-slate-400 font-mono text-lg">{word.phonetic}</div>
          <Badge variant="outline" className="mx-auto w-fit">
            {word.difficulty}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={onPlayAudio}
              className="flex items-center space-x-2 bg-transparent"
            >
              <Volume2 className="w-5 h-5" />
              <span>Listen</span>
            </Button>

            <Button
              size="lg"
              onClick={onStartRecording}
              disabled={isListening}
              className={`flex items-center space-x-2 ${
                isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-yellow-500 hover:bg-yellow-600"
              } text-slate-900`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Practice</span>
                </>
              )}
            </Button>
          </div>

          {/* Listening Animation */}
          {isListening && (
            <div className="flex justify-center items-center space-x-2 mb-6">
              <div className="flex space-x-1">
                <div className="w-2 h-8 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                <div
                  className="w-2 h-10 bg-red-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div className="w-2 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                <div className="w-2 h-7 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
              <span className="text-red-500 font-medium ml-4">Speak now...</span>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <Card
              className={`${
                feedback.isCorrect
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                  : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  {feedback.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  )}
                  <span
                    className={`font-semibold ${
                      feedback.isCorrect ? "text-green-800 dark:text-green-200" : "text-orange-800 dark:text-orange-200"
                    }`}
                  >
                    Score: {feedback.score}%
                  </span>
                </div>

                <Progress
                  value={feedback.score}
                  className={`mb-3 ${feedback.isCorrect ? "bg-green-200" : "bg-orange-200"}`}
                />

                <p
                  className={`text-center ${
                    feedback.isCorrect ? "text-green-700 dark:text-green-300" : "text-orange-700 dark:text-orange-300"
                  }`}
                >
                  {feedback.feedback}
                </p>

                <div className="flex justify-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="flex items-center space-x-1 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={onNextWord}
                    className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 flex items-center space-x-1"
                  >
                    <Target className="w-4 h-4" />
                    <span>Next Word</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="dark:text-white">Pronunciation Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Listen to the audio first to understand the correct pronunciation</li>
            <li>• Pay attention to the phonetic transcription guide</li>
            <li>• Speak clearly and at a normal pace</li>
            <li>• Welsh has unique sounds - don't worry if it takes practice!</li>
            <li>• Try to match the rhythm and intonation of the native speaker</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
