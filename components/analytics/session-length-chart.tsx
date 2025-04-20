"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", length: 12 },
  { month: "Feb", length: 15 },
  { month: "Mar", length: 18 },
  { month: "Apr", length: 14 },
  { month: "May", length: 16 },
  { month: "Jun", length: 13 },
  { month: "Jul", length: 17 },
  { month: "Aug", length: 15 },
  { month: "Sep", length: 14 },
  { month: "Oct", length: 16 },
  { month: "Nov", length: 15 },
  { month: "Dec", length: 13 },
]

export function SessionLengthChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorLength" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickFormatter={(value) => `${value}m`}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 shadow-md">
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    Average: <span className="font-medium">{payload[0].value} minutes</span>
                  </p>
                </Card>
              )
            }
            return null
          }}
        />
        <Area type="monotone" dataKey="length" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLength)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
