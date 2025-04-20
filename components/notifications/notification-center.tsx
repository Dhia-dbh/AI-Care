"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Clock, FileText, User } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Notification = {
  id: string
  type: "session" | "patient" | "system"
  title: string
  description: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    href: string
  }
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "session",
        title: "Session summary ready",
        description: "The summary for your session with Jane Doe is now available.",
        timestamp: "10 minutes ago",
        read: false,
        action: {
          label: "View Summary",
          href: "/patients/1",
        },
      },
      {
        id: "2",
        type: "patient",
        title: "New patient added",
        description: "John Smith has been added to your patient list.",
        timestamp: "1 hour ago",
        read: false,
        action: {
          label: "View Patient",
          href: "/patients/2",
        },
      },
      {
        id: "3",
        type: "system",
        title: "API key expiring soon",
        description: "Your transcription API key will expire in 7 days.",
        timestamp: "2 hours ago",
        read: true,
        action: {
          label: "Renew Key",
          href: "/settings",
        },
      },
      {
        id: "4",
        type: "session",
        title: "Transcription error",
        description: "There was an error processing the transcription for your session with Michael Brown.",
        timestamp: "Yesterday",
        read: true,
        action: {
          label: "Retry",
          href: "/patients/4",
        },
      },
      {
        id: "5",
        type: "system",
        title: "System update",
        description: "Doctor Assistant has been updated to version 2.1.0 with new features.",
        timestamp: "2 days ago",
        read: true,
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "session":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "patient":
        return <User className="h-4 w-4 text-green-500" />
      case "system":
        return <Bell className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md border bg-card p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>

            <Tabs defaultValue="all" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-2 max-h-[400px] space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="unread" className="mt-2 max-h-[400px] space-y-2 overflow-y-auto">
                {notifications.filter((n) => !n.read).length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No unread notifications</p>
                ) : (
                  notifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
                    ))
                )}
              </TabsContent>

              <TabsContent value="system" className="mt-2 max-h-[400px] space-y-2 overflow-y-auto">
                {notifications.filter((n) => n.type === "system").length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No system notifications</p>
                ) : (
                  notifications
                    .filter((n) => n.type === "system")
                    .map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
                    ))
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification
  onRead: (id: string) => void
}) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "session":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "patient":
        return <User className="h-4 w-4 text-green-500" />
      case "system":
        return <Bell className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Card
      className={cn(
        "flex cursor-pointer items-start gap-3 p-3 transition-colors hover:bg-muted/50",
        !notification.read && "border-l-2 border-l-primary bg-muted/30",
      )}
      onClick={() => onRead(notification.id)}
    >
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{notification.title}</h4>
        <p className="text-sm text-muted-foreground">{notification.description}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {notification.timestamp}
          </span>
          {notification.action && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" asChild>
              <a href={notification.action.href}>{notification.action.label}</a>
            </Button>
          )}
        </div>
      </div>
      {!notification.read && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            onRead(notification.id)
          }}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Mark as read</span>
        </Button>
      )}
    </Card>
  )
}
