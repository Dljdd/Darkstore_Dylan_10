'use client'

import React, { useState, useEffect } from "react"
import { UserIcon, AppWindowIcon, WarehouseIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import MyDetailsComponent from "@/components/dashboardPages/MyDetails"
import MyApplicationsComponent from "@/components/dashboardPages/MyApplication"
import MyWarehousesComponent from "@/components/dashboardPages/MyWarehouses"
import { Card, CardContent } from "@/components/ui/card"

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-muted rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <DashboardButton
          icon={<UserIcon className="w-6 h-6" />}
          title="My Details"
          onClick={() => setActiveSection("details")}
          active={activeSection === "details"}
          gradient="from-blue-500 to-cyan-500"
        />
        <DashboardButton
          icon={<AppWindowIcon className="w-6 h-6" />}
          title="My Applications"
          onClick={() => setActiveSection("applications")}
          active={activeSection === "applications"}
          gradient="from-purple-500 to-pink-500"
        />
        <DashboardButton
          icon={<WarehouseIcon className="w-6 h-6" />}
          title="My Warehouses"
          onClick={() => setActiveSection("warehouses")}
          active={activeSection === "warehouses"}
          gradient="from-orange-500 to-red-500"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-grow"
        >
          {activeSection === "details" && <MyDetailsComponent />}
          {activeSection === "applications" && <MyApplicationsComponent />}
          {activeSection === "warehouses" && <MyWarehousesComponent />}
          {!activeSection && (
            <Card className="bg-card">
              <CardContent className="p-8 text-center text-muted-foreground">
                <p className="text-lg">Select a section to view details</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface DashboardButtonProps {
  icon: React.ReactNode
  title: string
  onClick: () => void
  active: boolean
  gradient: string
}

const DashboardButton = ({ icon, title, onClick, active, gradient }: DashboardButtonProps) => (
  <button
    onClick={onClick}
    className={`relative p-6 rounded-xl transition-all duration-300 ${
      active ? 'scale-105' : 'hover:scale-105'
    } bg-card border border-border`}
  >
    <div className="relative z-10 flex flex-col items-center space-y-4">
      <div className={`p-3 rounded-full bg-gradient-to-r ${gradient}`}>
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
  </button>
)

export default DashboardPage