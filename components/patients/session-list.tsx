"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { usePatients } from "@/contexts/patient-context"
import { Clock, Edit, FileText, Trash2 } from "lucide-react"

interface SessionListProps {
  patientId: string
}

export function SessionList({ patientId }: SessionListProps) {
  const { toast } = useToast()
  const { getSessions, deleteSession } = usePatients()
  const sessions = getSessions(patientId)
  console.log("sessions", sessions)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(patientId, sessionId)
    toast({
      title: "Session Deleted",
      description: "The session has been deleted successfully.",
    })
  }

  if (sessions.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <FileText className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="mb-4 text-lg font-medium">No sessions yet</p>
        <p className="mb-6 text-sm text-muted-foreground">
          Start a new session to begin recording and transcribing your conversation.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-medium">
                  {new Date(session.date).toLocaleDateString()} - {session.title}
                </CardTitle>
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  <Clock className="h-3 w-3" />
                  {session.duration} min
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Summary</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                >
                  {expandedSession === session.id ? "Show Less" : "Show More"}
                </Button>
              </div>
              <p className={`text-sm text-muted-foreground ${expandedSession !== session.id && "line-clamp-3"}`}>
                {session.summary}
              </p>
            </div>

            {expandedSession === session.id && (
              <div className="mt-4 space-y-2 border-t pt-4">
                <h4 className="font-medium">Key Points</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {session.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>

                {session.prescriptions && session.prescriptions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Prescriptions</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {session.prescriptions.map((prescription, index) => (
                        <li key={index}>{prescription}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
