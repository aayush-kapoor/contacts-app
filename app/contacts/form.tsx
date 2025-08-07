"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Save, X, CheckCircle, AlertCircle } from 'lucide-react'
import { API_BASE_URL } from '@/config/api'

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [apiErrors, setApiErrors] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    // Clear success/error messages when user starts typing
    if (successMessage || apiErrors) {
      setSuccessMessage("")
      setApiErrors("")
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{8,10}$/.test(formData.phone.replace(/[\s\-\(\)\+]/g, ''))) {
      newErrors.phone = "Phone number must be 8-10 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setApiErrors("")
    setSuccessMessage("")
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage("Contact created successfully!")
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        })
        setErrors({})
      } else {
        // Handle validation errors from API
        if (data.errors) {
          const apiErrors: FormErrors = {}
          Object.keys(data.errors).forEach(key => {
            apiErrors[key as keyof FormErrors] = data.errors[key][0]
          })
          setErrors(apiErrors)
        } else {
          setApiErrors(data.message || "Failed to create contact")
        }
      }
    } catch (error) {
      setApiErrors("Network error. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    })
    setErrors({})
    setSuccessMessage("")
    setApiErrors("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">ADD NEW CONTACT</h1>
          <p className="text-sm text-neutral-400">Create a new contact entry in the database</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-500/20 border border-green-500 rounded">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-green-500 font-medium">SUCCESS!</p>
              <p className="text-xs text-neutral-400">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* API Error Message */}
      {apiErrors && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-red-500 font-medium">ERROR</p>
              <p className="text-xs text-neutral-400">{apiErrors}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-2xl">
        <Card className="bg-neutral-900 border-neutral-700/0">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <User className="w-5 h-5" />
              CONTACT INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs text-neutral-400 tracking-wider">
                    FIRST NAME*
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`bg-neutral-800 border-neutral-600 border-neutral-700/0 bg-neutral-800 border-0 text-white placeholder-neutral-400 focus-visible:ring-1 focus-visible:ring-orange-500/0 focus-visible:ring-offset-0 focus-visible:outline-none  ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    placeholder="Enter first name"
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs text-neutral-400 tracking-wider">
                    LAST NAME*
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`bg-neutral-800 border-neutral-600 border-neutral-700/0 bg-neutral-800 border-0 text-white placeholder-neutral-400 focus-visible:ring-1 focus-visible:ring-orange-500/0 focus-visible:ring-offset-0 focus-visible:outline-none  ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    placeholder="Enter last name"
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-neutral-400 tracking-wider">
                  EMAIL ADDRESS*
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 bg-neutral-800 border-neutral-600 border-neutral-700/0 bg-neutral-800 border-0 text-white placeholder-neutral-400 focus-visible:ring-1 focus-visible:ring-orange-500/0 focus-visible:ring-offset-0 focus-visible:outline-none  ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs text-neutral-400 tracking-wider">
                  PHONE NUMBER*
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`pl-10 bg-neutral-800 border-neutral-600 border-neutral-700/0 bg-neutral-800 border-0 text-white placeholder-neutral-400 focus-visible:ring-1 focus-visible:ring-orange-500/0 focus-visible:ring-offset-0 focus-visible:outline-none " ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    placeholder="Enter phone number"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Submit Status */}
              {isSubmitting && (
                <div className="p-4 bg-orange-500/20 border border-orange-500 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="text-sm text-orange-500 font-medium">CREATING CONTACT...</p>
                      {/* <p className="text-xs text-neutral-400">This operation takes 20 seconds to complete</p>
                      <div className="mt-2 w-full bg-neutral-800 rounded-full h-1">
                        <div className="bg-orange-500 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                      </div> */}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-neutral-700">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "CREATING..." : "CREATE CONTACT"}
                </Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  RESET FORM
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
