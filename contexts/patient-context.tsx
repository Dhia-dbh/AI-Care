"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type Patient = {
  id: string
  name: string
  sex: "Male" | "Female"
  dateOfBirth: string
  lastVisit?: string
}

type Session = {
  id: string
  title: string
  date: string
  duration: number
  transcript: string
  summary: string
  keyPoints: string[]
  prescriptions?: string[]
}

type PatientContextType = {
  patients: Patient[]
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  getPatientById: (id: string) => Patient | undefined
  getSessions: (patientId: string) => Session[]
  addSession: (patientId: string, session: Session) => void
  deleteSession: (patientId: string, sessionId: string) => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

// Mock data
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Mahdi Ben Ameur",
    sex: "Male",
    dateOfBirth: "2002-05-15",
    lastVisit: "2002-03-07",
  },
  {
    id: "2",
    name: "Yosr Ghanmi",
    sex: "Female",
    dateOfBirth: "2002-09-23",
    lastVisit: "2023-06-28",
  },
  {
    id: "3",
    name: "Dhia Ben Hamouda",
    sex: "Male",
    dateOfBirth: "2002-07-02",
    lastVisit: "2023-07-05",
  },

]

const mockSessions: Record<string, Session[]> = {
  "1": [
    {
      id: "101",
      title: "Annual Checkup",
      date: "2023-07-10T10:30:00Z",
      duration: 30,
      transcript:
        "Doctor: How have you been feeling lately?\nPatient: I've been having some headaches and fatigue.\nDoctor: How often do you experience these headaches?\nPatient: About 2-3 times per week.\nDoctor: Let's run some tests to check your iron levels and blood pressure.",
      summary:
        "Patient reported recurring headaches (2-3 times weekly) and general fatigue. Ordered blood tests to check iron levels and blood pressure. Recommended lifestyle changes including improved sleep hygiene and stress management techniques.",
      keyPoints: [
        "Recurring headaches 2-3 times weekly",
        "General fatigue reported",
        "Possible iron deficiency",
        "Blood pressure check recommended",
        "Sleep hygiene discussed",
      ],
      prescriptions: ["Iron supplement - 65mg daily", "Acetaminophen for headaches as needed"],
    },
    {
      id: "102",
      title: "Follow-up Appointment",
      date: "2023-06-15T14:00:00Z",
      duration: 20,
      transcript:
        "Doctor: How are you responding to the iron supplements?\nPatient: I think they're helping. I have more energy now.\nDoctor: That's good to hear. Are you still having headaches?\nPatient: Less frequently, maybe once a week now.\nDoctor: Great progress. Let's continue the current treatment plan.",
      summary:
        "Follow-up for iron deficiency and headaches. Patient reports improvement with iron supplements - increased energy and reduced headache frequency (now approximately once weekly). Recommended continuing current treatment plan with follow-up in 3 months.",
      keyPoints: [
        "Improved energy levels with iron supplementation",
        "Headache frequency reduced to once weekly",
        "Current treatment plan is effective",
        "Follow-up scheduled for 3 months",
      ],
    },
  ],
  "2": [
    {
      id: "201",
      title: "Hypertension Management",
      date: "2023-06-28T09:15:00Z",
      duration: 25,
      transcript:
        "Doctor: How have your blood pressure readings been at home?\nPatient: They've been averaging around 145/90.\nDoctor: That's still higher than we'd like. Have you been taking your medication regularly?\nPatient: Yes, but I sometimes forget on weekends.\nDoctor: It's important to maintain a consistent schedule. Let's adjust your medication and discuss some lifestyle changes.",
      summary:
        "Patient's hypertension is not adequately controlled with current medication regimen (home readings averaging 145/90). Patient admits to occasional missed doses on weekends. Adjusted medication dosage and emphasized importance of consistent adherence. Discussed dietary approaches to stop hypertension (DASH) and recommended daily 30-minute walks.",
      keyPoints: [
        "Blood pressure averaging 145/90 at home",
        "Inconsistent medication adherence on weekends",
        "Medication dosage adjusted",
        "DASH diet recommended",
        "Daily 30-minute walks prescribed",
      ],
      prescriptions: ["Lisinopril - increased to 20mg daily", "Hydrochlorothiazide - 12.5mg daily"],
    },
  ],
}

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [sessions, setSessions] = useState<Record<string, Session[]>>(mockSessions)

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient])
  }

  const updatePatient = (id: string, patientData: Partial<Patient>) => {
    setPatients((prev) => prev.map((patient) => (patient.id === id ? { ...patient, ...patientData } : patient)))
  }

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id))

    // Also delete associated sessions
    setSessions((prev) => {
      const newSessions = { ...prev }
      delete newSessions[id]
      return newSessions
    })
  }

  const getPatientById = (id: string) => {
    return patients.find((patient) => patient.id === id)
  }

  const getSessions = (patientId: string) => {
    return sessions[patientId] || []
  }

  const addSession = (patientId: string, session: Session) => {
    setSessions((prev) => {
      const patientSessions = prev[patientId] || []
      return {
        ...prev,
        [patientId]: [session, ...patientSessions],
      }
    })

    // Update patient's last visit date
    updatePatient(patientId, { lastVisit: new Date().toISOString() })
  }

  const deleteSession = (patientId: string, sessionId: string) => {
    setSessions((prev) => {
      const patientSessions = prev[patientId] || []
      return {
        ...prev,
        [patientId]: patientSessions.filter((session) => session.id !== sessionId),
      }
    })
  }

  return (
    <PatientContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        getSessions,
        addSession,
        deleteSession,
      }}
    >
      {children}
    </PatientContext.Provider>
  )
}

export function usePatients() {
  const context = useContext(PatientContext)
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider")
  }
  return context
}
