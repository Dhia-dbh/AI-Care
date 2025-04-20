"use client"

import type React from "react"

import { VoiceCommands } from "@/components/ai/voice-commands"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserDropdown } from "@/components/user-dropdown"
import { ActivitySquare, CalendarIcon, FileText, Home, Menu, Settings, User, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/patients", label: "Patients", icon: Users },
    { href: "/calendar", label: "Calendar", icon: CalendarIcon },
    { href: "/analytics", label: "Analytics", icon: ActivitySquare },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/profile", label: "Profile", icon: User },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false
    return pathname.startsWith(path)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col gap-4 py-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}

            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">AI-Care</span>
            </Link>
          </div>

          <nav className="hidden md:flex md:items-center md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <NotificationCenter />
            </div>

            <div className="flex items-center gap-2">
              <VoiceCommands />
              <ThemeToggle />

              <UserDropdown isMobile={isMobile} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/40">{children}</main>
    </div>
  )
}
