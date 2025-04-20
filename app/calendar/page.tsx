"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { usePatients } from "@/contexts/patient-context"
import { format, addHours, isSameDay } from "date-fns"
import { CalendarIcon, Clock, Plus, User } from "lucide-react"

type Appointment = {
  id: string
  title: string
  patientId: string
  date: Date
  duration: number
  notes?: string
  type: "checkup" | "follow-up" | "procedure" | "consultation"
}

export default function CalendarPage() {
  const { toast } = useToast()
  const { patients } = usePatients()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Annual Checkup",
      patientId: "1",
      date: new Date(new Date().setHours(9, 0, 0, 0)),
      duration: 30,
      notes: "Routine annual physical examination.",
      type: "checkup",
    },
    {
      id: "2",
      title: "Follow-up Appointment",
      patientId: "2",
      date: new Date(new Date().setHours(11, 30, 0, 0)),
      duration: 20,
      notes: "Follow-up on hypertension medication adjustment.",
      type: "follow-up",
    },
    {
      id: "3",
      title: "New Patient Consultation",
      patientId: "3",
      date: new Date(new Date().setHours(14, 0, 0, 0)),
      duration: 45,
      notes: "Initial consultation for new patient.",
      type: "consultation",
    },
  ])
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    title: "",
    patientId: "",
    date: new Date(),
    duration: 30,
    type: "checkup",
  })
  const [isAddingAppointment, setIsAddingAppointment] = useState(false)
  const [timePickerOpen, setTimePickerOpen] = useState(false)

  const handleAddAppointment = () => {
    if (!newAppointment.title || !newAppointment.patientId || !newAppointment.date || !newAppointment.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const appointment: Appointment = {
      id: crypto.randomUUID(),
      title: newAppointment.title,
      patientId: newAppointment.patientId,
      date: newAppointment.date!,
      duration: newAppointment.duration,
      notes: newAppointment.notes,
      type: newAppointment.type as "checkup" | "follow-up" | "procedure" | "consultation",
    }

    setAppointments([...appointments, appointment])
    setNewAppointment({
      title: "",
      patientId: "",
      date: new Date(),
      duration: 30,
      type: "checkup",
    })
    setIsAddingAppointment(false)

    toast({
      title: "Appointment Added",
      description: "The appointment has been added successfully.",
    })
  }

  const getDayAppointments = (date: Date | undefined) => {
    if (!date) return []
    return appointments.filter((appointment) => isSameDay(appointment.date, date))
  }

  const getPatientById = (id: string) => {
    return patients.find((patient) => patient.id === id)
  }

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case "checkup":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "follow-up":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "procedure":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "consultation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="mt-2 text-muted-foreground">Manage your appointments and schedule</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Add Appointment</CardTitle>
              <CardDescription>Schedule a new appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isAddingAppointment} onOpenChange={setIsAddingAppointment}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    New Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Appointment</DialogTitle>
                    <DialogDescription>Enter the details for the new appointment.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={newAppointment.title}
                        onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="patient" className="text-right">
                        Patient
                      </Label>
                      <Select
                        value={newAppointment.patientId}
                        onValueChange={(value) => setNewAppointment({ ...newAppointment, patientId: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newAppointment.date ? format(newAppointment.date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newAppointment.date}
                              onSelect={(date) => setNewAppointment({ ...newAppointment, date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <div className="col-span-3">
                        <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <Clock className="mr-2 h-4 w-4" />
                              {newAppointment.date ? format(newAppointment.date, "h:mm a") : <span>Select time</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-4">
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <Button
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => {
                                      const hours = i === 11 ? 12 : i + 1
                                      const newDate = new Date(newAppointment.date || new Date())
                                      newDate.setHours(hours, 0, 0, 0)
                                      setNewAppointment({ ...newAppointment, date: newDate })
                                    }}
                                  >
                                    {i === 11 ? 12 : i + 1}:00 AM
                                  </Button>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <Button
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => {
                                      const hours = i === 11 ? 12 : i + 1
                                      const newDate = new Date(newAppointment.date || new Date())
                                      newDate.setHours(hours + 12, 0, 0, 0)
                                      setNewAppointment({ ...newAppointment, date: newDate })
                                      setTimePickerOpen(false)
                                    }}
                                  >
                                    {i === 11 ? 12 : i + 1}:00 PM
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="duration" className="text-right">
                        Duration
                      </Label>
                      <Select
                        value={newAppointment.duration?.toString()}
                        onValueChange={(value) =>
                          setNewAppointment({ ...newAppointment, duration: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={newAppointment.type}
                        onValueChange={(value) =>
                          setNewAppointment({
                            ...newAppointment,
                            type: value as "checkup" | "follow-up" | "procedure" | "consultation",
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkup">Checkup</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="procedure">Procedure</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        value={newAppointment.notes || ""}
                        onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                        className="col-span-3"
                        placeholder="Optional notes about this appointment"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddAppointment}>
                      Add Appointment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}</CardTitle>
            <CardDescription>{getDayAppointments(selectedDate).length} appointments scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            {getDayAppointments(selectedDate).length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <CalendarIcon className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-4 text-lg font-medium">No appointments scheduled</p>
                <p className="mb-6 text-sm text-muted-foreground">
                  There are no appointments scheduled for this day. Click the button below to add a new appointment.
                </p>
                <Button onClick={() => setIsAddingAppointment(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {getDayAppointments(selectedDate)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((appointment) => {
                    const patient = getPatientById(appointment.patientId)
                    const endTime = addHours(appointment.date, appointment.duration / 60)

                    return (
                      <div
                        key={appointment.id}
                        className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{appointment.title}</h4>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getAppointmentTypeColor(
                                  appointment.type,
                                )}`}
                              >
                                {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {format(appointment.date, "h:mm a")} - {format(endTime, "h:mm a")} (
                                {appointment.duration} min)
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{patient?.name || "Unknown Patient"}</p>
                            {patient && (
                              <p className="text-xs text-muted-foreground">
                                {patient.sex}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}{" "}
                                years
                              </p>
                            )}
                          </div>
                        </div>

                        {appointment.notes && <p className="mt-2 text-sm text-muted-foreground">{appointment.notes}</p>}
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
