import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { calculateAge } from "@/lib/utils"
import { FileText, User2 } from "lucide-react"

interface PatientCardProps {
  patient: {
    id: string
    name: string
    sex: "Male" | "Female"
    dateOfBirth: string
    lastVisit?: string
  }
}

export function PatientCard({ patient }: PatientCardProps) {
  const age = calculateAge(new Date(patient.dateOfBirth))

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User2 className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <h3 className="font-semibold">{patient.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{patient.sex}</span>
          <span>•</span>
          <span>{age} years</span>
        </div>
        {patient.lastVisit && (
          <p className="mt-2 text-xs text-muted-foreground">
            Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 border-t bg-muted/50 p-2">
        <Button asChild variant="ghost" size="sm" className="flex-1">
          <Link href={`/patients/${patient.id}`}>View History</Link>
        </Button>
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/patients/${patient.id}?tab=new`}>
            <FileText className="mr-1 h-3 w-3" />
            New Session
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
