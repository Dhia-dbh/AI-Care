"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { Moon, Save, Sun } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [apiKeys, setApiKeys] = useState({
    transcriptionApiKey: "",
    llmApiKey: "",
  })
  const [features, setFeatures] = useState({
    autoTranscribe: true,
    autoSummarize: true,
    ragEnabled: true,
    notificationsEnabled: true,
  })

  const handleSaveApiKeys = () => {
    // In a real app, you would save these to a secure storage
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been securely saved.",
    })
  }

  const handleFeatureToggle = (feature: keyof typeof features) => {
    setFeatures({
      ...features,
      [feature]: !features[feature],
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">Configure your Doctor Assistant application</p>
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Configure the API keys for transcription and LLM services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transcription-api-key">Transcription API Key</Label>
                <Input
                  id="transcription-api-key"
                  type="password"
                  placeholder="Enter your transcription API key"
                  value={apiKeys.transcriptionApiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, transcriptionApiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Used for real-time transcription of doctor-patient conversations
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="llm-api-key">LLM API Key</Label>
                <Input
                  id="llm-api-key"
                  type="password"
                  placeholder="Enter your LLM API key"
                  value={apiKeys.llmApiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, llmApiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Used for summarizing transcripts and generating medical insights
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveApiKeys} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save API Keys
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
              <CardDescription>Enable or disable specific features of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-transcribe">Auto Transcription</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically start transcribing when a session begins
                  </p>
                </div>
                <Switch
                  id="auto-transcribe"
                  checked={features.autoTranscribe}
                  onCheckedChange={() => handleFeatureToggle("autoTranscribe")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-summarize">Auto Summarization</Label>
                  <p className="text-sm text-muted-foreground">Automatically generate summaries when a session ends</p>
                </div>
                <Switch
                  id="auto-summarize"
                  checked={features.autoSummarize}
                  onCheckedChange={() => handleFeatureToggle("autoSummarize")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="rag-enabled">RAG History</Label>
                  <p className="text-sm text-muted-foreground">
                    Build and maintain a Retrieval-Augmented Generation history for each patient
                  </p>
                </div>
                <Switch
                  id="rag-enabled"
                  checked={features.ragEnabled}
                  onCheckedChange={() => handleFeatureToggle("ragEnabled")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme Mode</Label>
                    <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setTheme("light")}
                      className="h-8 w-8"
                    >
                      <Sun className="h-4 w-4" />
                      <span className="sr-only">Light Mode</span>
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setTheme("dark")}
                      className="h-8 w-8"
                    >
                      <Moon className="h-4 w-4" />
                      <span className="sr-only">Dark Mode</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
                </div>
                <Switch
                  id="notifications-enabled"
                  checked={features.notificationsEnabled}
                  onCheckedChange={() => handleFeatureToggle("notificationsEnabled")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
