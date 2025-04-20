"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePatients } from "@/contexts/patient-context"
import { AlertTriangle, CheckCircle, Clock, FileText, Loader2, XCircle } from "lucide-react"

interface TreatmentSummaryProps {
  patientId: string
}

export function TreatmentSummary({ patientId }: TreatmentSummaryProps) {
  const { getSessions } = usePatients()
  const sessions = getSessions(patientId)
  const [loading, setLoading] = useState(true)
  const [treatments, setTreatments] = useState<any[]>([])

  useEffect(() => {
    const generateTreatmentSummary = async () => {
      setLoading(true)

      try {
        // In a real app, this would call an LLM to analyze all sessions and generate insights
        // For now, we'll simulate this with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockTreatments = [
          {
            name: "Antibiotics for Respiratory Infection",
            status: "success",
            description: "Patient responded well to the prescribed antibiotics. Symptoms resolved within 7 days.",
            dates: "First prescribed on May 15, 2023",
          },
          {
            name: "Physical Therapy for Lower Back Pain",
            status: "mixed",
            description: "Patient reports partial relief. Continuing therapy with modified exercises.",
            dates: "Ongoing since June 3, 2023",
          },
          {
            name: "Dietary Changes for Digestive Issues",
            status: "pending",
            description: "Recently recommended. Patient is implementing changes. Follow-up needed.",
            dates: "Started on July 10, 2023",
          },
          {
            name: "Blood Pressure Medication",
            status: "failure",
            description: "Patient experienced side effects. Discontinued and replaced with alternative.",
            dates: "Tried from April 5 to April 20, 2023",
          },
        ]

        setTreatments(mockTreatments)
      } catch (error) {
        console.error("Error generating treatment summary:", error)
      } finally {
        setLoading(false)
      }
    }

    if (sessions.length > 0) {
      generateTreatmentSummary()
    } else {
      setLoading(false)
    }
  }, [sessions])

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing treatment history...</p>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <FileText className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="mb-4 text-lg font-medium">No treatment data available</p>
        <p className="text-sm text-muted-foreground">Complete at least one session to generate treatment insights.</p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "mixed":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "failure":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Effectiveness</CardTitle>
              <CardDescription>Summary of treatments and their effectiveness based on session data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatments.map((treatment, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="mt-0.5">{getStatusIcon(treatment.status)}</div>
                    <div>
                      <h4 className="font-medium">{treatment.name}</h4>
                      <p className="text-sm text-muted-foreground">{treatment.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{treatment.dates}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Patterns and recommendations based on patient history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Pattern detected:</span> Patient responds better to treatments when
                  combined with lifestyle modifications.
                </p>
                <p>
                  <span className="font-medium">Recommendation:</span> Consider holistic approach combining medication
                  with dietary and exercise recommendations.
                </p>
                <p>
                  <span className="font-medium">Follow-up:</span> Schedule a check-in within 2 weeks of any new
                  treatment to assess early response and adjust as needed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medication History</CardTitle>
              <CardDescription>Complete history of prescribed medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Amoxicillin 500mg</h4>
                  <p className="text-sm text-muted-foreground">Prescribed for respiratory infection on May 15, 2023</p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Completed course with positive outcome</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Lisinopril 10mg</h4>
                  <p className="text-sm text-muted-foreground">Prescribed for hypertension on April 5, 2023</p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <XCircle className="h-3 w-3 text-red-500" />
                    <span>Discontinued due to side effects (cough)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Procedures & Therapies</CardTitle>
              <CardDescription>Non-medication treatments and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Physical Therapy</h4>
                  <p className="text-sm text-muted-foreground">For lower back pain, started on June 3, 2023</p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span>Ongoing with partial improvement</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Dietary Modification</h4>
                  <p className="text-sm text-muted-foreground">
                    Low FODMAP diet for digestive issues, started on July 10, 2023
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <span>Recently started, monitoring progress</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
