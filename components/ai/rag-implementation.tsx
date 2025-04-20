"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { usePatients } from "@/contexts/patient-context"
import { Brain, Loader2, Search } from "lucide-react"

interface RAGImplementationProps {
  patientId: string
}

export function RAGImplementation({ patientId }: RAGImplementationProps) {
  const { toast } = useToast()
  const { getPatientById, getSessions } = usePatients()
  const patient = getPatientById(patientId)
  const sessions = getSessions(patientId)
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a search query.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setSearchResults(null)

    try {
      // In a real app, this would call a vector database and LLM
      // For this demo, we'll simulate the RAG process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock RAG results based on the query
      const mockResults = generateMockResults(query.toLowerCase())
      setSearchResults(mockResults)
    } catch (error) {
      console.error("RAG search error:", error)
      toast({
        title: "Search Failed",
        description: "There was an error processing your query. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const generateMockResults = (query: string) => {
    // This is a simplified mock of what a real RAG system would do
    // In a real app, this would use embeddings and semantic search

    const results = []

    // Check if query contains certain keywords and return relevant "chunks"
    if (query.includes("headache") || query.includes("pain")) {
      results.push({
        source: "Session on July 10, 2023",
        text: "Patient reported recurring headaches (2-3 times weekly) and general fatigue. Ordered blood tests to check iron levels and blood pressure.",
        relevance: 0.92,
      })
    }

    if (query.includes("medication") || query.includes("prescription")) {
      results.push({
        source: "Session on July 10, 2023",
        text: "Prescribed iron supplement - 65mg daily and acetaminophen for headaches as needed.",
        relevance: 0.88,
      })
    }

    if (query.includes("iron") || query.includes("supplement") || query.includes("fatigue")) {
      results.push({
        source: "Follow-up on June 15, 2023",
        text: "Patient reports improvement with iron supplements - increased energy and reduced headache frequency (now approximately once weekly).",
        relevance: 0.95,
      })
    }

    if (query.includes("sleep") || query.includes("insomnia")) {
      results.push({
        source: "Session on August 5, 2023",
        text: "Patient mentioned difficulty sleeping, particularly falling asleep. Discussed sleep hygiene practices and recommended avoiding screens before bedtime.",
        relevance: 0.91,
      })
    }

    // If no specific matches, return generic results
    if (results.length === 0) {
      results.push({
        source: "Patient History",
        text: "No specific information found related to your query. The patient has had 3 sessions in the past 6 months focusing primarily on general wellness, iron deficiency, and headache management.",
        relevance: 0.65,
      })
    }

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Knowledge Base</CardTitle>
        <CardDescription>Search through patient history using Retrieval-Augmented Generation (RAG)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ask a question about this patient's history..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>

        {isSearching ? (
          <div className="mt-6 flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Searching patient history...</p>
          </div>
        ) : searchResults ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Search Results</h3>
            </div>

            {searchResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">No results found for your query.</p>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div key={index} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">{result.source}</p>
                      <span className="text-xs text-muted-foreground">
                        Relevance: {Math.round(result.relevance * 100)}%
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{result.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Brain className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">Ask anything about this patient</p>
            <p className="mb-6 text-sm text-muted-foreground">
              Search through all sessions, notes, and medical history using natural language.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">Example questions:</p>
              <ul className="space-y-1 text-left">
                <li>• "When did the patient last complain about headaches?"</li>
                <li>• "What medications have been prescribed for this patient?"</li>
                <li>• "Has the patient mentioned any sleep issues?"</li>
                <li>• "Summarize the patient's progress with iron supplements"</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>
          RAG combines retrieval of relevant information with generative AI to provide accurate, contextual answers
          based on this patient's specific history.
        </p>
      </CardFooter>
    </Card>
  )
}
