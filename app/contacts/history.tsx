"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, History, User, Edit, Plus, Trash2, Clock } from 'lucide-react'

export default function ContactHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHistory, setSelectedHistory] = useState(null)

  // Mock data - will be replaced with API calls
  const historyEntries = [
    {
      id: 1,
      contactId: 1,
      contactName: "John Doe",
      action: "created",
      field: null,
      oldValue: null,
      newValue: null,
      timestamp: "2025-01-06 14:30:00",
      userId: "system",
    },
    {
      id: 2,
      contactId: 1,
      contactName: "John Doe",
      action: "updated",
      field: "phone",
      oldValue: "+1-555-0122",
      newValue: "+1-555-0123",
      timestamp: "2025-01-06 15:45:00",
      userId: "admin",
    },
    {
      id: 3,
      contactId: 2,
      contactName: "Jane Smith",
      action: "created",
      field: null,
      oldValue: null,
      newValue: null,
      timestamp: "2025-01-05 09:15:00",
      userId: "system",
    },
    {
      id: 4,
      contactId: 2,
      contactName: "Jane Smith",
      action: "updated",
      field: "email",
      oldValue: "j.smith@example.com",
      newValue: "jane.smith@example.com",
      timestamp: "2025-01-06 11:20:00",
      userId: "admin",
    },
  ]

  const getActionColor = (action) => {
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

  const getActionIcon = (action) => {
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
      entry.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.field && entry.field.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">EDIT HISTORY</h1>
          <p className="text-sm text-neutral-400">Track all changes made to contacts</p>
        </div>
      </div>


      {/* History Timeline */}
      <Card className="bg-neutral-900 border-neutral-700">
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
                        <span className="text-sm text-white font-medium">{entry.contactName}</span>
                      </div>
                      
                      {entry.action === "created" ? (
                        <p className="text-sm text-neutral-300">Contact was created in the system</p>
                      ) : entry.action === "updated" ? (
                        <div className="text-sm text-neutral-300">
                          <p className="mb-1">Field <span className="text-orange-500 font-mono">{entry.field}</span> was updated</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-neutral-400">Old value:</span>
                              <span className="text-red-400 font-mono ml-2">{entry.oldValue}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400">New value:</span>
                              <span className="text-white font-mono ml-2">{entry.newValue}</span>
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
                      <span className="font-mono">{entry.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span className="font-mono">{entry.userId}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* History Detail Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-wider">CHANGE DETAILS</CardTitle>
                <p className="text-sm text-neutral-400 font-mono">Entry ID: {selectedHistory.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedHistory(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">CONTACT</p>
                  <p className="text-sm text-white">{selectedHistory.contactName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">ACTION</p>
                  <Badge className={getActionColor(selectedHistory.action)}>
                    {selectedHistory.action.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">TIMESTAMP</p>
                  <p className="text-sm text-white font-mono">{selectedHistory.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">USER</p>
                  <p className="text-sm text-white font-mono">{selectedHistory.userId}</p>
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
                        {selectedHistory.oldValue}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 tracking-wider mb-1">NEW VALUE</p>
                      <p className="text-sm text-white font-mono bg-neutral-800 p-2 rounded">
                        {selectedHistory.newValue}
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
