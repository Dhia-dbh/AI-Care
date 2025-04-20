"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SessionLengthChart } from "@/components/analytics/session-length-chart"
import { CommonDiagnosesChart } from "@/components/analytics/common-diagnoses-chart"
import { PatientDemographicsChart } from "@/components/analytics/patient-demographics-chart"
import { TreatmentEffectivenessChart } from "@/components/analytics/treatment-effectiveness-chart"
import { usePatients } from "@/contexts/patient-context"

export default function AnalyticsPage() {
  const { patients } = usePatients()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-muted-foreground">Insights and statistics from your patient sessions</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10)} from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 100) + 50}</div>
                <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20)} from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Length</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 10) + 15} min</div>
                <p className="text-xs text-muted-foreground">-{Math.floor(Math.random() * 5)} min from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Transcription Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 5) + 95}%</div>
                <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 3)}% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Session Length Trends</CardTitle>
                <CardDescription>Average session duration over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <SessionLengthChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Common Diagnoses</CardTitle>
                <CardDescription>Most frequent diagnoses from sessions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <CommonDiagnosesChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Length Distribution</CardTitle>
              <CardDescription>Duration of patient sessions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <SessionLengthChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
              <CardDescription>Age and gender distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PatientDemographicsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Effectiveness</CardTitle>
              <CardDescription>Success rates of different treatments</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TreatmentEffectivenessChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
