"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { usePatients } from "@/contexts/patient-context"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface AddPatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPatientModal({ open, onOpenChange }: AddPatientModalProps) {
  const { toast } = useToast()
  const { addPatient } = usePatients()
  const [formData, setFormData] = useState({
    name: "",
    sex: "Male" as "Male" | "Female",
    dateOfBirth: new Date(),
  })
  const [calendarOpen, setCalendarOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter the patient's name.",
        variant: "destructive",
      })
      return
    }

    addPatient({
      id: crypto.randomUUID(),
      name: formData.name,
      sex: formData.sex,
      dateOfBirth: formData.dateOfBirth.toISOString(),
    })

    toast({
      title: "Patient Added",
      description: "The patient has been added successfully.",
    })

    setFormData({
      name: "",
      sex: "Male",
      dateOfBirth: new Date(),
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Enter the patient's information to add them to your records.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter patient's full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Sex</Label>
              <RadioGroup
                value={formData.sex}
                onValueChange={(value) => setFormData({ ...formData, sex: value as "Male" | "Female" })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={(date) => {
                      if (date) {
                        setFormData({ ...formData, dateOfBirth: date })
                        setCalendarOpen(false)
                      }
                    }}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
