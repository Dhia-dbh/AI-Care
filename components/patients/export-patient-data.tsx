"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { usePatients } from "@/contexts/patient-context"
import { Download, FileDown, Loader2 } from "lucide-react"

interface ExportPatientDataProps {
  patientId?: string // Optional - if provided, exports only this patient
}

export function ExportPatientData({ patientId }: ExportPatientDataProps) {
  const { toast } = useToast()
  const { patients, getPatientById, getSessions } = usePatients()
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "pdf">("json")
  const [exportOptions, setExportOptions] = useState({
    includePersonalInfo: true,
    includeSessions: true,
    includeTranscripts: false,
    includeSummaries: true,
  })

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      let dataToExport: any = {}

      if (patientId) {
        // Export single patient
        const patient = getPatientById(patientId)
        const sessions = getSessions(patientId)

        if (!patient) {
          throw new Error("Patient not found")
        }

        dataToExport = {
          patient: exportOptions.includePersonalInfo ? patient : { id: patient.id, name: patient.name },
          sessions: exportOptions.includeSessions
            ? sessions.map((session) => ({
                ...session,
                transcript: exportOptions.includeTranscripts ? session.transcript : undefined,
                summary: exportOptions.includeSummaries ? session.summary : undefined,
              }))
            : [],
        }
      } else {
        // Export all patients
        dataToExport = patients.map((patient) => {
          const sessions = getSessions(patient.id)

          return {
            patient: exportOptions.includePersonalInfo ? patient : { id: patient.id, name: patient.name },
            sessions: exportOptions.includeSessions
              ? sessions.map((session) => ({
                  ...session,
                  transcript: exportOptions.includeTranscripts ? session.transcript : undefined,
                  summary: exportOptions.includeSummaries ? session.summary : undefined,
                }))
              : [],
          }
        })
      }

      // Generate file based on format
      let fileContent = ""
      let fileName = ""
      let mimeType = ""

      switch (exportFormat) {
        case "json":
          fileContent = JSON.stringify(dataToExport, null, 2)
          fileName = patientId ? `patient_${patientId}.json` : "all_patients.json"
          mimeType = "application/json"
          break
        case "csv":
          // Simple CSV conversion for demo purposes
          // In a real app, you'd use a proper CSV library
          fileContent = "Patient ID,Name,Sex,Date of Birth\n"
          if (patientId) {
            const patient = getPatientById(patientId)
            if (patient) {
              fileContent += `${patient.id},${patient.name},${patient.sex},${patient.dateOfBirth}\n`
            }
          } else {
            patients.forEach((patient) => {
              fileContent += `${patient.id},${patient.name},${patient.sex},${patient.dateOfBirth}\n`
            })
          }
          fileName = patientId ? `patient_${patientId}.csv` : "all_patients.csv"
          mimeType = "text/csv"
          break
        case "pdf":
          // In a real app, you'd generate a PDF
          // For this demo, we'll just show a message
          toast({
            title: "PDF Export",
            description: "PDF export would be generated here in a real application.",
          })
          setIsExporting(false)
          return
      }

      // Create and download the file
      const blob = new Blob([fileContent], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `Data has been exported as ${exportFormat.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export {patientId ? "Patient" : "All"} Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Patient Data</DialogTitle>
          <DialogDescription>
            {patientId
              ? "Export this patient's data in your preferred format."
              : "Export all patient data in your preferred format."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Export Format</h4>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as "json" | "csv" | "pdf")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json">JSON</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf">PDF</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Export Options</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includePersonalInfo"
                  checked={exportOptions.includePersonalInfo}
                  onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includePersonalInfo: !!checked })}
                />
                <Label htmlFor="includePersonalInfo">Include personal information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSessions"
                  checked={exportOptions.includeSessions}
                  onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeSessions: !!checked })}
                />
                <Label htmlFor="includeSessions">Include sessions</Label>
              </div>
              <div className="flex items-center space-x-2 pl-6">
                <Checkbox
                  id="includeTranscripts"
                  checked={exportOptions.includeTranscripts}
                  disabled={!exportOptions.includeSessions}
                  onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeTranscripts: !!checked })}
                />
                <Label
                  htmlFor="includeTranscripts"
                  className={!exportOptions.includeSessions ? "text-muted-foreground" : ""}
                >
                  Include full transcripts
                </Label>
              </div>
              <div className="flex items-center space-x-2 pl-6">
                <Checkbox
                  id="includeSummaries"
                  checked={exportOptions.includeSummaries}
                  disabled={!exportOptions.includeSessions}
                  onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeSummaries: !!checked })}
                />
                <Label
                  htmlFor="includeSummaries"
                  className={!exportOptions.includeSessions ? "text-muted-foreground" : ""}
                >
                  Include summaries
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
