"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Users, Plus, Search, Edit, Trash2, History, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import ContactsList from "./contacts/page"
import ContactForm from "./contacts/form"
import ContactHistory from "./contacts/history"

interface LatestHistoryEntry {
  id: number
  created_at: string
  action: string
  contact: {
    first_name: string
    last_name: string
  }
}

export default function ContactsApp() {
  const [activeSection, setActiveSection] = useState("contacts")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [latestUpdate, setLatestUpdate] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Fetch the latest history entry
  const fetchLatestUpdate = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/contact-histories?per_page=1')
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        const latestEntry: LatestHistoryEntry = data.data[0]
        const date = new Date(latestEntry.created_at)
        
        // Format as MM/DD/YYYY HH:MM
        const formattedDate = date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        
        setLatestUpdate(`${formattedDate} ${formattedTime}`)
      } else {
        setLatestUpdate("NO UPDATES")
      }
    } catch (error) {
      setLatestUpdate("ERROR")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestUpdate()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLatestUpdate, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-orange-500 font-bold text-lg tracking-wider">CONTACTS</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-orange-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "contacts", icon: Users, label: "CONTACTS LIST" },
              { id: "add", icon: Plus, label: "ADD CONTACT" },
              { id: "history", icon: History, label: "EDIT HISTORY" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              CONTACTS SYSTEM / <span className="text-orange-500">{activeSection.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              {loading ? (
                <span>LOADING...</span>
              ) : (
                <span>LAST UPDATE: {latestUpdate}</span>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "contacts" && <ContactsList />}
          {activeSection === "add" && <ContactForm />}
          {activeSection === "history" && <ContactHistory />}
        </div>
      </div>
    </div>
  )
}
