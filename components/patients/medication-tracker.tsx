"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { AlertCircle, CalendarIcon, Check, Clock, Edit, Pill, Plus, Trash2, X } from "lucide-react"
import { useState } from "react"

interface MedicationTrackerProps {
  patientId: string
}

type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: Date
  endDate?: Date
  notes?: string
  status: "active" | "completed" | "discontinued"
}

export function MedicationTracker({ patientId }: MedicationTrackerProps) {
  const { toast } = useToast()
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      startDate: new Date(2023, 4, 15),
      endDate: new Date(2023, 4, 22),
      notes: "Take with food to reduce stomach upset.",
      status: "completed",
    },
    {
      id: "2",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: new Date(2023, 3, 5),
      endDate: new Date(2023, 3, 20),
      notes: "Discontinued due to side effects (cough).",
      status: "discontinued",
    },
    {
      id: "3",
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily at bedtime",
      startDate: new Date(2023, 5, 10),
      notes: "For cholesterol management.",
      status: "active",
    },
  ])
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: "",
    dosage: "",
    frequency: "",
    startDate: new Date(),
    status: "active",
  })
  const [isAddingMedication, setIsAddingMedication] = useState(false)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency || !newMedication.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const medication: Medication = {
      id: crypto.randomUUID(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      startDate: newMedication.startDate,
      endDate: newMedication.endDate,
      notes: newMedication.notes,
      status: newMedication.status as "active" | "completed" | "discontinued",
    }

    setMedications([medication, ...medications])
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      startDate: new Date(),
      status: "active",
    })
    setIsAddingMedication(false)

    toast({
      title: "Medication Added",
      description: "The medication has been added successfully.",
    })
  }

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id))
    toast({
      title: "Medication Removed",
      description: "The medication has been removed successfully.",
    })
  }

  const handleStatusChange = (id: string, status: "active" | "completed" | "discontinued") => {
    setMedications(
      medications.map((med) =>
        med.id === id
          ? {
            ...med,
            status,
            endDate: status !== "active" ? new Date() : med.endDate,
          }
          : med,
      ),
    )

    toast({
      title: "Status Updated",
      description: `Medication status updated to ${status}.`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "discontinued":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medication Tracker</CardTitle>
        <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>Enter the details of the medication to add it to the tracker.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., 500mg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Input
                  id="frequency"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Twice daily"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start Date</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newMedication.startDate ? format(newMedication.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newMedication.startDate}
                      onSelect={(date) => {
                        setNewMedication({ ...newMedication, startDate: date })
                        setStartDateOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">End Date</Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newMedication.endDate ? format(newMedication.endDate, "PPP") : <span>Optional</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newMedication.endDate}
                      onSelect={(date) => {
                        setNewMedication({ ...newMedication, endDate: date })
                        setEndDateOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newMedication.status}
                  onValueChange={(value) =>
                    setNewMedication({
                      ...newMedication,
                      status: value as "active" | "completed" | "discontinued",
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newMedication.notes || ""}
                  onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                  className="col-span-3"
                  placeholder="Optional notes about this medication"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddMedication}>
                Add Medication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Pill className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-4 text-lg font-medium">No medications</p>
            <p className="mb-6 text-sm text-muted-foreground">
              Add medications to track prescriptions and treatment plans.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Pill className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {medication.name} ({medication.dosage})
                      </h4>
                      <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                      {getStatusIcon(medication.status)}
                      <span className="capitalize">{medication.status}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteMedication(medication.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>Started: {format(new Date(medication.startDate), "MMM d, yyyy")}</span>
                  </div>
                  {medication.endDate && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Ended: {format(new Date(medication.endDate), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>

                {medication.notes && (
                  <div className="mt-2 flex items-start gap-1 rounded-md bg-muted p-2 text-xs">
                    <AlertCircle className="mt-0.5 h-3 w-3 text-muted-foreground" />
                    <p>{medication.notes}</p>
                  </div>
                )}

                {medication.status === "active" && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleStatusChange(medication.id, "completed")}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Mark as Completed
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleStatusChange(medication.id, "discontinued")}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Discontinue
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
