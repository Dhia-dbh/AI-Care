"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function TestToast() {
  const { toast } = useToast()

  const showToast = () => {
    console.log("Showing test toast")
    toast({
      title: "Test Toast",
      description: "This is a test toast notification",
      variant: "default",
    })
  }

  return (
    <div className="p-4">
      <Button onClick={showToast}>Show Test Toast</Button>
    </div>
  )
}
