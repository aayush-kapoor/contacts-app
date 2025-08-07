"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Mail, Phone, User, MoreHorizontal, AlertCircle, Loader2 } from 'lucide-react'

interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  data: Contact[]
  pagination?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export default function ContactsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    total_contacts: 0,
    recent_updates: 0,
    system_status: "ONLINE"
  })

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/contacts')
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setContacts(data.data)
      } else {
        setError("Failed to fetch contacts")
      }
    } catch (error) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/contacts/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  useEffect(() => {
    fetchContacts()
    fetchStats()
  }, [])

  const filteredContacts = contacts.filter(
    (contact) => {
      const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase()
      const searchLower = searchTerm.toLowerCase()
      
      return (
        contact.first_name.toLowerCase().includes(searchLower) ||
        contact.last_name.toLowerCase().includes(searchLower) ||
        fullName.includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.phone.toLowerCase().includes(searchLower)
      )
    }
  )

  const handleDeleteContact = async (contactId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/contacts/${contactId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh contacts list
        fetchContacts()
        fetchStats()
        setSelectedContact(null)
      } else {
        setError("Failed to delete contact")
      }
    } catch (error) {
      setError("Network error. Please check your connection.")
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="text-white">Loading contacts...</span>
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
          <h1 className="text-2xl font-bold text-white tracking-wider">CONTACTS DATABASE</h1>
          <p className="text-sm text-neutral-400">Manage your contact information</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <User className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
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

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* <Card className="lg:col-span-1 bg-neutral-900/0 border-neutral-700/0">
          <CardContent className="p-4">
            
          </CardContent>
        </Card> */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-neutral-800 border-0 text-white placeholder-neutral-400 focus-visible:ring-1 focus-visible:ring-orange-500/40 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_rgba(249,115,22,0.2)]"
          />
        </div>
{/* 
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL CONTACTS</p>
                <p className="text-2xl font-bold text-white font-mono">{stats.total_contacts}</p>
              </div>
              <User className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">RECENT UPDATES</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{stats.recent_updates}</p>
              </div>
              <Edit className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">SYSTEM STATUS</p>
                <p className="text-2xl font-bold text-white font-mono">{stats.system_status}</p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Contacts Table */}
      <Card className="bg-neutral-900 border-neutral-700/0">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            ALL CONTACTS ({stats.total_contacts})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider w-48">NAME</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider w-64">EMAIL</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider w-40">PHONE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider w-36">CREATED</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider w-36">UPDATED</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider w-24">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className={`border-b border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-neutral-900" : "bg-neutral-850"
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {contact.first_name[0]}{contact.last_name[0]}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-white font-medium truncate">
                            {contact.first_name} {contact.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        <span className="text-xs text-neutral-300 font-mono truncate">{contact.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        <span className="text-xs text-neutral-300 font-mono truncate">{contact.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-300 font-mono truncate">
                      {new Date(contact.created_at).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })} {new Date(contact.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-300 font-mono truncate">
                      {new Date(contact.updated_at).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })} {new Date(contact.updated_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500 hover:bg-neutral-300/0 h-8 w-8">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-neutral-400 hover:text-red-800 hover:bg-neutral-300/0 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteContact(contact.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredContacts.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-neutral-400">No contacts found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-wider">
                  {selectedContact.first_name} {selectedContact.last_name}
                </CardTitle>
                <p className="text-sm text-neutral-400 font-mono">ID: {selectedContact.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedContact(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">EMAIL ADDRESS</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-white font-mono">{selectedContact.email}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">PHONE NUMBER</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-white font-mono">{selectedContact.phone}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">CREATED</p>
                  <p className="text-sm text-white font-mono">
                    {new Date(selectedContact.created_at).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })} {new Date(selectedContact.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">LAST UPDATED</p>
                  <p className="text-sm text-white font-mono">
                    {new Date(selectedContact.updated_at).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })} {new Date(selectedContact.updated_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Contact
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  View History
                </Button>
                <Button
                  variant="outline"
                  className="border-red-700 text-red-400 hover:bg-red-800 hover:text-red-300 bg-transparent"
                  onClick={() => handleDeleteContact(selectedContact.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
