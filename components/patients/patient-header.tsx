import { Button } from "@/components/ui/button"
import { calculateAge } from "@/lib/utils"
import { ArrowLeft, Calendar, User2 } from "lucide-react"
import Link from "next/link"

interface PatientHeaderProps {
  patient: {
    id: string
    name: string
    sex: "Male" | "Female"
    dateOfBirth: string
  }
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const age = calculateAge(new Date(patient.dateOfBirth))

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/patients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to patients</span>
          </Link>
        </Button>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <User2 className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{patient.sex}</span>
            <span>•</span>
            <span>{age} years old</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(patient.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
