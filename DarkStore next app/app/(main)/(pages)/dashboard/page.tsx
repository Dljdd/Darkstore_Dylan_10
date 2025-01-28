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
      <div className="flex items-center justify-center min-h-screen bg-black text-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-gray-600 border-gray-800 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 relative min-h-screen bg-black text-gray-300">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-black/80 backdrop-blur-lg flex items-center border-b border-gray-800">
        Account
      </h1>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <DashboardButton
            icon={<UserIcon className="h-12 w-12" />}
            title="My Details"
            onClick={() => setActiveSection("details")}
            active={activeSection === "details"}
            gradient="from-gray-900 to-gray-700"
          />
          <DashboardButton
            icon={<AppWindowIcon className="h-12 w-12" />}
            title="My Applications"
            onClick={() => setActiveSection("applications")}
            active={activeSection === "applications"}
            gradient="from-gray-900 to-gray-700"
          />
          <DashboardButton
            icon={<WarehouseIcon className="h-12 w-12" />}
            title="My Warehouses"
            onClick={() => setActiveSection("warehouses")}
            active={activeSection === "warehouses"}
            gradient="from-gray-900 to-gray-700"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-12 w-full max-w-2xl"
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                {activeSection === "details" && <MyDetailsComponent />}
                {activeSection === "applications" && <MyApplicationsComponent />}
                {activeSection === "warehouses" && <MyWarehousesComponent />}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
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

const DashboardButton: React.FC<DashboardButtonProps> = ({ icon, title, onClick, active, gradient }) => {
  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-2xl transition-all duration-300 ease-in-out
        ${active ? 'scale-105' : 'scale-100 hover:scale-105'}
        group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-600
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative z-10 flex flex-col items-center justify-center p-8 h-64 text-gray-300">
        <motion.div
          className="mb-4"
          initial={{ rotate: 0 }}
          animate={{ rotate: active ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-bold mb-2 tracking-wider">{title}</h3>
        <motion.div
          className="h-1 bg-gray-500 rounded-full"
          initial={{ width: "3rem" }}
          whileHover={{ width: "6rem" }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="absolute inset-0 border-4 border-gray-700 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  )
}

export default DashboardPage