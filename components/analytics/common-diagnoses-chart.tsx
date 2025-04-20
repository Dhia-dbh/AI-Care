"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Hypertension", count: 24 },
  { name: "Diabetes", count: 18 },
  { name: "Anxiety", count: 15 },
  { name: "Asthma", count: 12 },
  { name: "Arthritis", count: 10 },
  { name: "Depression", count: 9 },
  { name: "Allergies", count: 8 },
]

export function CommonDiagnosesChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
        <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))" }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 shadow-md">
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    Occurrences: <span className="font-medium">{payload[0].value}</span>
                  </p>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
