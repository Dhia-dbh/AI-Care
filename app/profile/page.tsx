"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/contexts/user-context"
import { LogOut, Save, User } from "lucide-react"

export default function ProfilePage() {
  const { toast } = useToast()
  const { user, updateUser, logout } = useUser()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    specialty: user?.specialty || "",
    bio: user?.bio || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser(formData)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal information and account settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.specialty}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/settings">Account Settings</a>
              </Button>
              <Button variant="destructive" className="w-full" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and professional information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Medical Specialty</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Cardiology, Family Medicine, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short bio about your professional experience..."
                  rows={4}
                />
              </div>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
