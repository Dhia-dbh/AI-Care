"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Antibiotics", success: 85, failure: 15, color: "#34d399" },
  { name: "Physical Therapy", success: 70, failure: 30, color: "#60a5fa" },
  { name: "Dietary Changes", success: 65, failure: 35, color: "#a78bfa" },
  { name: "Blood Pressure Meds", success: 80, failure: 20, color: "#f472b6" },
  { name: "Pain Management", success: 75, failure: 25, color: "#fbbf24" },
]

export function TreatmentEffectivenessChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} stackOffset="expand" layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickFormatter={(value) => `${value}%`}
        />
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
                    Success rate: <span className="font-medium">{payload[0].value}%</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Failure rate: <span className="font-medium">{payload[1].value}%</span>
                  </p>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar dataKey="success" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
        <Bar dataKey="failure" stackId="a" fill="#f87171" radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
