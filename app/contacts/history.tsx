"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, History, User, Edit, Plus, Trash2, Clock, AlertCircle, Loader2, X } from 'lucide-react'

interface ContactHistory {
  id: number
  contact_id: number
  contact: {
    first_name: string
    last_name: string
  }
  action: string
  field: string | null
  old_value: string | null
  new_value: string | null
  timestamp: string
  user_id: string
  created_at: string
}

interface ApiResponse {
  success: boolean
  data: ContactHistory[]
  pagination?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export default function ContactHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHistory, setSelectedHistory] = useState<ContactHistory | null>(null)
  const [historyEntries, setHistoryEntries] = useState<ContactHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch history from API
  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/contact-histories')
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setHistoryEntries(data.data)
      } else {
        setError("Failed to fetch history")
      }
    } catch (error) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-white/20 text-white"
      case "updated":
        return "bg-orange-500/20 text-orange-500"
      case "deleted":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <Plus className="w-4 h-4" />
      case "updated":
        return <Edit className="w-4 h-4" />
      case "deleted":
        return <Trash2 className="w-4 h-4" />
      default:
        return <History className="w-4 h-4" />
    }
  }

  const filteredHistory = historyEntries.filter(
    (entry) =>
      `${entry.contact.first_name} ${entry.contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.field && entry.field.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="text-white">Loading history...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">EDIT HISTORY</h1>
          <p className="text-sm text-neutral-400">Track all changes made to contacts</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-red-500 font-medium">ERROR</p>
              <p className="text-xs text-neutral-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* History Timeline */}
      <Card className="bg-neutral-900 border-neutral-700/0">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">CHANGE TIMELINE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.map((entry) => (
              <div
                key={entry.id}
                className="border border-neutral-700 rounded p-4 hover:border-orange-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedHistory(entry)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-full">
                      {getActionIcon(entry.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActionColor(entry.action)}>
                          {entry.action.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-white font-medium">
                          {entry.contact.first_name} {entry.contact.last_name}
                        </span>
                      </div>
                      
                      {entry.action === "created" ? (
                        <p className="text-sm text-neutral-300">Contact was created in the system</p>
                      ) : entry.action === "updated" ? (
                        <div className="text-sm text-neutral-300">
                          <p className="mb-1">Field <span className="text-orange-500 font-mono">{entry.field}</span> was updated</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-neutral-400">Old value:</span>
                              <span className="text-red-400 font-mono ml-2">{entry.old_value}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400">New value:</span>
                              <span className="text-green-400 font-mono ml-2">{entry.new_value}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-300">Contact was deleted from the system</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs text-neutral-400 space-y-1">
                                          <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">{new Date(entry.created_at).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric'
                        })} {new Date(entry.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}</span>
                      </div>
                    {/* <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span className="font-mono">{entry.user_id}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredHistory.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-neutral-400">No history entries found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* History Detail Modal */}
              {selectedHistory && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedHistory(null)}
          >
          <Card 
            className="bg-neutral-900 border-neutral-700/0 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-wider">CHANGE DETAILS</CardTitle>
                <p className="text-sm text-neutral-400 font-mono">Entry ID: {selectedHistory.id}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedHistory(null)}
                className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 w-8"
              >
                <X className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">CONTACT</p>
                  <p className="text-sm text-white">
                    {selectedHistory.contact.first_name} {selectedHistory.contact.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">ACTION</p>
                  <Badge className={getActionColor(selectedHistory.action)}>
                    {selectedHistory.action.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">TIMESTAMP</p>
                  <p className="text-sm text-white font-mono">
                    {new Date(selectedHistory.created_at).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })} {new Date(selectedHistory.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">USER</p>
                  <p className="text-sm text-white font-mono">{selectedHistory.user_id}</p>
                </div>
              </div>

              {selectedHistory.field && (
                <div className="space-y-2 pt-4 border-t border-neutral-700">
                  <p className="text-xs text-neutral-400 tracking-wider">FIELD CHANGED</p>
                  <p className="text-sm text-orange-500 font-mono">{selectedHistory.field}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-neutral-400 tracking-wider mb-1">OLD VALUE</p>
                      <p className="text-sm text-red-400 font-mono bg-neutral-800 p-2 rounded">
                        {selectedHistory.old_value}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 tracking-wider mb-1">NEW VALUE</p>
                      <p className="text-sm text-green-400 font-mono bg-neutral-800 p-2 rounded">
                        {selectedHistory.new_value}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
