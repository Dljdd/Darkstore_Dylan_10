'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ref, set } from "firebase/database"
import { database } from "@/firebase" // Make sure this import is correct
import { User, Phone, CreditCard, Mail, Save } from "lucide-react"

export default function Component() {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    pan: "",
    email: "",
  })
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Initialize form with empty values
    setUserDetails({
      firstName: "",
      lastName: "",
      phone: "",
      pan: "",
      email: "",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserDetails({
      ...userDetails,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userRef = ref(database, 'myDetails')
    set(userRef, userDetails)
      .then(() => {
        console.log("User Details Saved Successfully")
        localStorage.setItem("userEmail", userDetails.email)
        setShowPopup(true)
        setTimeout(() => setShowPopup(false), 3000)
      })
      .catch((error) => {
        console.error("Error saving user details:", error)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 shadow-2xl">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-2xl font-bold text-center text-white">My Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-300">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userDetails.firstName}
                    onChange={handleChange}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-300">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userDetails.lastName}
                    onChange={handleChange}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleChange}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
                  placeholder="1234567890"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan" className="text-sm font-medium text-gray-300">
                PAN Card Number
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  type="text"
                  id="pan"
                  name="pan"
                  value={userDetails.pan}
                  onChange={handleChange}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
                  placeholder="ABCDE1234F"
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <Save className="mr-2" size={18} />
              Save Details
            </Button>
          </form>
        </CardContent>
      </Card>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100">
            <p className="text-green-400 font-semibold text-lg">Data saved successfully!</p>
          </div>
        </div>
      )}
    </div>
  )
}