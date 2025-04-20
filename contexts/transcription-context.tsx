"use client"

import type React from "react"

import { createContext, useContext, useRef, useState } from "react"

type TranscriptionContextType = {
  isTranscribing: boolean
  transcript: string
  audioRecording: Blob | null
  isRecordingAudio: boolean
  startTranscription: () => void
  stopTranscription: () => void
  resetTranscription: () => void
  startAudioRecording: () => void
  stopAudioRecording: () => Promise<void>
  generateSummary: (transcript: string) => Promise<{
    text: string
    keyPoints: string[]
    prescriptions: string[]
  }>
}

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined)

export function TranscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [transcriptionInterval, setTranscriptionInterval] = useState<NodeJS.Timeout | null>(null)
  const [audioRecording, setAudioRecording] = useState<Blob | null>(null)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)

  // References for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Mock transcription service
  const startTranscription = () => {
    setIsTranscribing(true)

    // Simulate real-time transcription with mock data
    const mockPhrases = [
      "Doctor: Good morning, how are you feeling today?",
      "Patient: I've been having some trouble sleeping lately.",
      "Doctor: I'm sorry to hear that. How long has this been going on?",
      "Patient: For about two weeks now. I think it might be stress-related.",
      "Doctor: That's certainly possible. Let's talk about your stress levels and sleep habits.",
      "Patient: I've been working longer hours and have a big project due soon.",
      "Doctor: I see. Are you having trouble falling asleep or staying asleep?",
      "Patient: Mostly falling asleep. My mind just keeps racing with thoughts about work.",
      "Doctor: That's common with stress-induced insomnia. Let's discuss some strategies that might help.",
      "Patient: That would be great. I've tried over-the-counter sleep aids but they leave me groggy.",
      "Doctor: I understand. Let's focus on sleep hygiene practices first before considering medication.",
    ]

    let index = 0

    const interval = setInterval(() => {
      if (index < mockPhrases.length) {
        setTranscript((prev) => prev + (prev ? "\n\n" : "") + mockPhrases[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, 3000) // Add a new phrase every 3 seconds

    setTranscriptionInterval(interval)
  }

  const stopTranscription = () => {
    setIsTranscribing(false)

    if (transcriptionInterval) {
      clearInterval(transcriptionInterval)
      setTranscriptionInterval(null)
    }
  }

  const resetTranscription = () => {
    console.log('resetTranscription called')
    stopTranscription()
    setTranscript("")
    // setAudioRecording(null)
  }

  // Audio recording functionality
  const startAudioRecording = async () => {
    try {
      // Reset any previous recordings
      audioChunksRef.current = []
      setAudioRecording(null)

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Start recording
      mediaRecorder.start()
      setIsRecordingAudio(true)
    } catch (error) {
      console.error('Error starting audio recording:', error)
      setIsRecordingAudio(false)
    }
  }

  const stopAudioRecording = async () => {
    return new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        setIsRecordingAudio(false)
        resolve()
        return
      }

      // Set up the onstop handler to create the final audio blob
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioRecording(audioBlob)
        setIsRecordingAudio(false)

        // Stop all tracks in the stream
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
        }

        resolve()
      }

      // Stop the recording
      mediaRecorderRef.current.stop()
    })
  }

  // Mock LLM summary generation
  const generateSummary = async (transcript: string) => {
    // In a real app, this would call an LLM API
    // For now, we'll simulate a delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      text: "Patient reported difficulty sleeping for the past two weeks, primarily trouble falling asleep due to racing thoughts about work. Patient attributes the issue to increased stress from longer work hours and an upcoming project deadline. Patient has tried over-the-counter sleep aids but experienced grogginess as a side effect. Discussed sleep hygiene practices as a first-line approach before considering medication.",
      keyPoints: [
        "Insomnia for past two weeks",
        "Difficulty falling asleep due to racing thoughts",
        "Work-related stress as likely cause",
        "Previous negative experience with OTC sleep aids",
        "Sleep hygiene practices recommended",
      ],
      prescriptions: [],
    }
  }

  return (
    <TranscriptionContext.Provider
      value={{
        isTranscribing,
        transcript,
        audioRecording,
        isRecordingAudio,
        startTranscription,
        stopTranscription,
        resetTranscription,
        startAudioRecording,
        stopAudioRecording,
        generateSummary,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  )
}

export function useTranscription() {
  const context = useContext(TranscriptionContext)
  if (context === undefined) {
    throw new Error("useTranscription must be used within a TranscriptionProvider")
  }
  return context
}
