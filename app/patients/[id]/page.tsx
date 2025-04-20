"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SessionList } from "@/components/patients/session-list"
import { NewSessionForm } from "@/components/patients/new-session-form"
import { TreatmentSummary } from "@/components/patients/treatment-summary"
import { PatientHeader } from "@/components/patients/patient-header"
import { usePatients } from "@/contexts/patient-context"
import { Loader2 } from "lucide-react"
import { PatientTimeline } from "@/components/patients/patient-timeline"
import { MedicationTracker } from "@/components/patients/medication-tracker"
import { RAGImplementation } from "@/components/ai/rag-implementation"
import { ExportPatientData } from "@/components/patients/export-patient-data"

export default function PatientDetailPage() {
  const params = useParams()
  const patientId = params.id as string
  const { getPatientById } = usePatients()
  const [patient, setPatient] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("history")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true)
      try {
        const patientData = getPatientById(patientId)
        setPatient(patientData)
      } catch (error) {
        console.error("Error fetching patient:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [patientId, getPatientById])

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Patient Not Found</h2>
          <p className="text-muted-foreground">The patient you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PatientHeader patient={patient} />

      <div className="mt-4 flex justify-end">
        <ExportPatientData patientId={patientId} />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="history">Session History</TabsTrigger>
            <TabsTrigger value="new">New Session</TabsTrigger>
            <TabsTrigger value="summary">Treatment Summary</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="history" className="m-0">
              <SessionList patientId={patientId} />
            </TabsContent>

            <TabsContent value="new" className="m-0">
              <NewSessionForm patientId={patientId} onSessionComplete={() => setActiveTab("history")} />
            </TabsContent>

            <TabsContent value="summary" className="m-0">
              <TreatmentSummary patientId={patientId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="mt-8">
        <PatientTimeline patientId={patientId} />
      </div>

      <div className="mt-8">
        <MedicationTracker patientId={patientId} />
      </div>

      <div className="mt-8">
        <RAGImplementation patientId={patientId} />
      </div>
    </div>
  )
}
