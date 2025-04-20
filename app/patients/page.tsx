"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PatientCard } from "@/components/patients/patient-card"
import { AddPatientModal } from "@/components/patients/add-patient-modal"
import { usePatients } from "@/contexts/patient-context"
import { Search, UserPlus } from "lucide-react"

export default function PatientsPage() {
  const { patients } = usePatients()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)

  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button onClick={() => setIsAddPatientOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patients by name..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="mb-4 text-lg font-medium">No patients found</p>
          <p className="mb-6 text-sm text-muted-foreground">
            {searchQuery
              ? "Try a different search term or add a new patient."
              : "Add your first patient to get started."}
          </p>
          <Button onClick={() => setIsAddPatientOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}

      <AddPatientModal open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen} />
    </div>
  )
}
