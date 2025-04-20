"use client"

import { Card } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const ageData = [
  { name: "0-18", value: 15, color: "#60a5fa" },
  { name: "19-35", value: 25, color: "#34d399" },
  { name: "36-50", value: 30, color: "#a78bfa" },
  { name: "51-65", value: 20, color: "#fbbf24" },
  { name: "65+", value: 10, color: "#f87171" },
]

const genderData = [
  { name: "Male", value: 45, color: "#60a5fa" },
  { name: "Female", value: 55, color: "#f472b6" },
]

export function PatientDemographicsChart() {
  return (
    <div className="grid h-full grid-cols-2 gap-4">
      <div>
        <h3 className="mb-2 text-center text-sm font-medium">Age Distribution</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={ageData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {ageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2 shadow-md">
                      <p className="font-medium">{payload[0].name}</p>
                      <p className="text-sm text-muted-foreground">
                        Patients: <span className="font-medium">{payload[0].value}</span>
                      </p>
                    </Card>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="mb-2 text-center text-sm font-medium">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2 shadow-md">
                      <p className="font-medium">{payload[0].name}</p>
                      <p className="text-sm text-muted-foreground">
                        Patients: <span className="font-medium">{payload[0].value}</span>
                      </p>
                    </Card>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
