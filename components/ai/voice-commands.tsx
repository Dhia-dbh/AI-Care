"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useTranscription } from "@/contexts/transcription-context"
import { useRouter } from "next/navigation"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function VoiceCommands() {
  const { toast } = useToast()
  const router = useRouter()
  const { startTranscription, stopTranscription } = useTranscription()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [showCommandList, setShowCommandList] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Available voice commands
  const commands = [
    { command: "go to home", action: () => router.push("/") },
    { command: "go to patients", action: () => router.push("/patients") },
    { command: "go to analytics", action: () => router.push("/analytics") },
    { command: "go to settings", action: () => router.push("/settings") },
    { command: "go to profile", action: () => router.push("/profile") },
    { command: "start recording", action: () => startTranscription() },
    { command: "stop recording", action: () => stopTranscription() },
    { command: "show commands", action: () => setShowCommandList(true) },
    { command: "hide commands", action: () => setShowCommandList(false) },
  ]

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.error("Speech recognition not supported in this browser")
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onstart = () => {
      setIsListening(true)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex
      const transcriptText = event.results[current][0].transcript.toLowerCase().trim()
      setTranscript(transcriptText)

      // Check if the transcript matches any commands
      if (event.results[current].isFinal) {
        processCommand(transcriptText)
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      try {
        recognitionRef.current?.start()
        setTranscript("")
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }

  const processCommand = (text: string) => {
    // Find matching command
    const matchedCommand = commands.find((cmd) => text.includes(cmd.command))

    if (matchedCommand) {
      // Provide visual feedback
      toast({
        title: "Voice Command Detected",
        description: `Executing: "${matchedCommand.command}"`,
      })

      // Execute the command
      matchedCommand.action()

      // Clear transcript after command execution
      setTimeout(() => {
        setTranscript("")
      }, 2000)
    }
  }

  return (
    <div className="relative">
      <Button
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={toggleListening}
        className={`relative h-10 w-10 ${isListening ? "bg-primary text-primary-foreground" : ""}`}
        aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
      >
        {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
        {isListening && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3 rounded-full bg-red-500">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border bg-card p-3 shadow-md"
          >
            <p className="text-xs font-medium">I heard:</p>
            <p className="mt-1 text-sm">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowCommandList(!showCommandList)}
        className="ml-2 h-10 w-10"
        aria-label={showCommandList ? "Hide commands" : "Show commands"}
      >
        <Volume2 className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {showCommandList && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border bg-card p-3 shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Available Voice Commands</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCommandList(false)} className="h-6 w-6">
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
            <ul className="space-y-1">
              {commands.map((cmd, index) => (
                <li key={index} className="text-sm">
                  &quot;{cmd.command}&quot;
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
