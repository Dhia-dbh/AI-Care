import { AppShell } from "@/components/app-shell"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PatientProvider } from "@/contexts/patient-context"
import { TranscriptionProvider } from "@/contexts/transcription-context"
import { UserProvider } from "@/contexts/user-context"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Doctor Assistant",
  description: "AI-powered tool for doctor-patient conversations",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <PatientProvider>
              <TranscriptionProvider>
                <AppShell>{children}</AppShell>
                <Toaster />
              </TranscriptionProvider>
            </PatientProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
