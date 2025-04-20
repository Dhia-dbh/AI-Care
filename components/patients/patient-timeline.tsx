"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePatients } from "@/contexts/patient-context"
import { Activity, Calendar, CheckCircle, FileText, Pill, Stethoscope, User } from "lucide-react"

interface PatientTimelineProps {
  patientId: string
}

type TimelineEvent = {
  id: string
  date: string
  type: "session" | "medication" | "test" | "note" | "registration"
  title: string
  description: string
  status?: "completed" | "scheduled" | "cancelled" | "ongoing"
  metadata?: Record<string, any>
}

export function PatientTimeline({ patientId }: PatientTimelineProps) {
  const { getPatientById, getSessions } = usePatients()
  const patient = getPatientById(patientId)
  const sessions = getSessions(patientId)
  const [activeTab, setActiveTab] = useState("all")

  // Generate timeline events from patient data and sessions
  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = []

    // Add patient registration
    if (patient) {
      events.push({
        id: "registration",
        date: patient.dateOfBirth, // Using DOB as a placeholder for registration date
        type: "registration",
        title: "Patient Registration",
        description: `${patient.name} was registered as a new patient.`,
      })
    }

    // Add sessions
    sessions.forEach((session) => {
      events.push({
        id: session.id,
        date: session.date,
        type: "session",
        title: session.title,
        description: `Session conducted: ${session.summary.substring(0, 100)}...`,
        status: "completed",
        metadata: {
          duration: session.duration,
          keyPoints: session.keyPoints,
        },
      })

      // Add medications if prescribed in the session
      if (session.prescriptions && session.prescriptions.length > 0) {
        session.prescriptions.forEach((prescription, index) => {
          events.push({
            id: `${session.id}-med-${index}`,
            date: session.date, // Same date as the session
            type: "medication",
            title: "Medication Prescribed",
            description: prescription,
            status: "ongoing",
          })
        })
      }
    })

    // Add mock lab tests
    events.push({
      id: "test-1",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      type: "test",
      title: "Blood Test",
      description: "Complete blood count and metabolic panel.",
      status: "completed",
      metadata: {
        results: "Normal range for all values.",
      },
    })

    events.push({
      id: "test-2",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days in future
      type: "test",
      title: "Follow-up X-Ray",
      description: "Chest X-ray to monitor progress.",
      status: "scheduled",
    })

    // Sort events by date (newest first)
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const timelineEvents = generateTimelineEvents()

  const filteredEvents =
    activeTab === "all" ? timelineEvents : timelineEvents.filter((event) => event.type === activeTab)

  const getEventIcon = (type: string) => {
    switch (type) {
      case "session":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "medication":
        return <Pill className="h-4 w-4 text-green-500" />
      case "test":
        return <Activity className="h-4 w-4 text-amber-500" />
      case "note":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "registration":
        return <User className="h-4 w-4 text-primary" />
      default:
        return <Stethoscope className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "scheduled":
        return <Calendar className="h-3 w-3 text-blue-500" />
      case "cancelled":
        return <Activity className="h-3 w-3 text-red-500" />
      case "ongoing":
        return <Activity className="h-3 w-3 text-amber-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="session">Sessions</TabsTrigger>
            <TabsTrigger value="medication">Medications</TabsTrigger>
            <TabsTrigger value="test">Tests</TabsTrigger>
            <TabsTrigger value="note">Notes</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {filteredEvents.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">No timeline events found</p>
              </div>
            ) : (
              <div className="relative space-y-4 pl-6 before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-muted">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-muted">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {getStatusIcon(event.status)}
                          <span>{event.status}</span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} at{" "}
                        {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>

                      {event.type === "session" && event.metadata?.keyPoints && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">Key Points:</p>
                          <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
                            {event.metadata.keyPoints.slice(0, 2).map((point: string, index: number) => (
                              <li key={index}>{point}</li>
                            ))}
                            {event.metadata.keyPoints.length > 2 && (
                              <li className="text-xs text-primary">
                                +{event.metadata.keyPoints.length - 2} more points
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
