"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { usePatients } from "@/contexts/patient-context"
import { useTranscription } from "@/contexts/transcription-context"
import { Loader2, Mic, MicOff, Pause, Play, Save } from "lucide-react"
import { useEffect, useState } from "react"

interface NewSessionFormProps {
  patientId: string
  onSessionComplete: () => void
}

export function NewSessionForm({ patientId, onSessionComplete }: NewSessionFormProps) {
  const { toast } = useToast()
  const { addSession } = usePatients()
  const { isTranscribing, transcript, startTranscription, stopTranscription, resetTranscription, generateSummary } =
    useTranscription()

  const [sessionTitle, setSessionTitle] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [timer])

  const handleStartTranscription = () => {
    startTranscription()

    const interval = setInterval(() => {
      setSessionDuration((prev) => prev + 1)
    }, 60000) // Update every minute

    setTimer(interval)

    toast({
      title: "Transcription Started",
      description: "The session is now being recorded and transcribed.",
    })
  }

  const handleStopTranscription = () => {
    stopTranscription()

    if (timer) {
      clearInterval(timer)
      setTimer(null)
    }

    toast({
      title: "Transcription Stopped",
      description: "The session recording has been paused.",
    })
  }

  const handleFinishSession = async () => {
    if (!sessionTitle) {
      toast({
        title: "Error",
        description: "Please enter a session title.",
        variant: "destructive",
      })
      return
    }

    if (transcript.trim().length === 0) {
      toast({
        title: "Error",
        description: "The transcript is empty. Please record a session first.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingSummary(true)

    try {
      // In a real app, this would call an LLM to generate a summary
      const summary = await generateSummary(transcript)

      addSession(patientId, {
        id: crypto.randomUUID(),
        title: sessionTitle,
        date: new Date().toISOString(),
        duration: sessionDuration || 1,
        transcript,
        summary: summary.text,
        keyPoints: summary.keyPoints,
        prescriptions: summary.prescriptions,
      })

      toast({
        title: "Session Completed",
        description: "The session has been saved and summarized successfully.",
      })

      // Reset the form
      setSessionTitle("")
      setSessionDuration(0)
      resetTranscription()
      onSessionComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-title">Session Title</Label>
            <Input
              id="session-title"
              placeholder="Enter a title for this session"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-md bg-muted p-4">
            <div className="flex items-center gap-2">
              {isTranscribing ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                  <Mic className="h-4 w-4 animate-pulse" />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground">
                  <MicOff className="h-4 w-4" />
                </div>
              )}
              <div>
                <p className="font-medium">{isTranscribing ? "Recording in progress" : "Recording paused"}</p>
                <p className="text-sm text-muted-foreground">
                  {sessionDuration > 0 ? `Duration: ${sessionDuration} min` : "Start recording to begin transcription"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {isTranscribing ? (
                <Button variant="outline" size="icon" onClick={handleStopTranscription} className="h-8 w-8">
                  <Pause className="h-4 w-4" />
                  <span className="sr-only">Pause Recording</span>
                </Button>
              ) : (
                <Button variant="default" size="icon" onClick={handleStartTranscription} className="h-8 w-8">
                  <Play className="h-4 w-4" />
                  <span className="sr-only">Start Recording</span>
                </Button>
              )}
            </div>
          </div>

          {transcript && <div className="space-y-2">
            <Label htmlFor="transcript">Transcript</Label>
            <Textarea
              id="transcript"
              placeholder="Transcript will appear here as the conversation is recorded..."
              value={transcript}
              readOnly
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This transcript is being generated in real-time and may contain errors.
            </p>
          </div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetTranscription}>
            Clear Transcript
          </Button>
          <Button
            onClick={handleFinishSession}
            disabled={isGeneratingSummary || transcript.trim().length === 0}
            className="flex items-center gap-2"
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Finish & Summarize
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
