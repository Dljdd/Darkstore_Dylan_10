'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ref, push } from "firebase/database"
import { database } from "@/firebase"
import { Warehouse, Plus, Save } from "lucide-react"

interface WarehouseType {
  id: number
  darkStoreName: string
  warehouseSize: string
  ceilingHeight: string
  warehouseAddress: string
  storageCapacity: string
  loadingDock: boolean
  powerBackup: boolean
  temperatureControl: string
  securityFeatures: string
  operationalHours: string
  accessibility: string
  availableFacilities: string
  insuranceCoverage: boolean
  fireSafetyCompliance: string
  yearOfEstablishment: string
  certifications: string
}

export default function Component() {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [warehouseDetails, setWarehouseDetails] = useState<WarehouseType>({
    id: 0,
    darkStoreName: "",
    warehouseSize: "",
    ceilingHeight: "",
    warehouseAddress: "",
    storageCapacity: "",
    loadingDock: false,
    powerBackup: false,
    temperatureControl: "",
    securityFeatures: "",
    operationalHours: "",
    accessibility: "",
    availableFacilities: "",
    insuranceCoverage: false,
    fireSafetyCompliance: "",
    yearOfEstablishment: "",
    certifications: "",
  })

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target
    setWarehouseDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleWarehouseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newWarehouse = {
      ...warehouseDetails,
      id: warehouses.length + 1,
    }
    const warehouseRef = ref(database, "warehouses")
    push(warehouseRef, newWarehouse)
      .then(() => {
        setWarehouses([...warehouses, newWarehouse])
        setWarehouseDetails({
          id: 0,
          darkStoreName: "",
          warehouseSize: "",
          ceilingHeight: "",
          warehouseAddress: "",
          storageCapacity: "",
          loadingDock: false,
          powerBackup: false,
          temperatureControl: "",
          securityFeatures: "",
          operationalHours: "",
          accessibility: "",
          availableFacilities: "",
          insuranceCoverage: false,
          fireSafetyCompliance: "",
          yearOfEstablishment: "",
          certifications: "",
        })
        setShowForm(false)
      })
      .catch((error) => {
        console.error("Error saving warehouse to Firebase: ", error)
      })
  }

  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-6">My Warehouses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="bg-black/95 border border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">{warehouse.darkStoreName}</CardTitle>
              <Warehouse className="h-5 w-5 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{warehouse.warehouseSize} sq.ft</div>
              <p className="text-sm text-neutral-400 mt-1">{warehouse.warehouseAddress}</p>
            </CardContent>
          </Card>
        ))}
        <Card 
          className="bg-black/95 border border-neutral-800 hover:bg-neutral-900 transition-colors cursor-pointer" 
          onClick={() => setShowForm(true)}
        >
          <CardHeader className="flex flex-row items-center justify-center h-full">
            <Plus className="h-12 w-12 text-neutral-400 hover:text-white transition-colors" />
          </CardHeader>
        </Card>
      </div>
      {showForm && (
        <Card className="bg-black/95 border border-neutral-800 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Add New Warehouse</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWarehouseSubmit} className="space-y-6">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="darkStoreName" className="text-neutral-200">Dark Store Name</Label>
                      <Input
                        id="darkStoreName"
                        name="darkStoreName"
                        value={warehouseDetails.darkStoreName}
                        onChange={handleWarehouseChange}
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                        placeholder="Enter Dark Store Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warehouseSize" className="text-neutral-200">Warehouse Size (sq.ft)</Label>
                      <Input
                        type="number"
                        id="warehouseSize"
                        name="warehouseSize"
                        value={warehouseDetails.warehouseSize}
                        onChange={handleWarehouseChange}
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                        placeholder="Enter Warehouse Size"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ceilingHeight" className="text-neutral-200">Ceiling Height</Label>
                      <Input
                        type="number"
                        id="ceilingHeight"
                        name="ceilingHeight"
                        value={warehouseDetails.ceilingHeight}
                        onChange={handleWarehouseChange}
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                        placeholder="Enter Ceiling Height"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storageCapacity" className="text-neutral-200">Storage Capacity (pallets/shelves)</Label>
                      <Input
                        type="number"
                        id="storageCapacity"
                        name="storageCapacity"
                        value={warehouseDetails.storageCapacity}
                        onChange={handleWarehouseChange}
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                        placeholder="Enter Storage Capacity"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouseAddress" className="text-neutral-200">Warehouse Address</Label>
                    <Input
                      id="warehouseAddress"
                      name="warehouseAddress"
                      value={warehouseDetails.warehouseAddress}
                      onChange={handleWarehouseChange}
                      className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                      placeholder="Enter Warehouse Address"
                      required
                    />
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="loadingDock"
                        name="loadingDock"
                        checked={warehouseDetails.loadingDock}
                        onCheckedChange={(checked) =>
                          handleWarehouseChange({
                            target: { name: "loadingDock", type: "checkbox", checked },
                          } as any)
                        }
                        className="border-neutral-800 data-[state=checked]:bg-neutral-700"
                      />
                      <Label htmlFor="loadingDock" className="text-neutral-200">Loading Dock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="powerBackup"
                        name="powerBackup"
                        checked={warehouseDetails.powerBackup}
                        onCheckedChange={(checked) =>
                          handleWarehouseChange({
                            target: { name: "powerBackup", type: "checkbox", checked },
                          } as any)
                        }
                        className="border-neutral-800 data-[state=checked]:bg-neutral-700"
                      />
                      <Label htmlFor="powerBackup" className="text-neutral-200">Power Backup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="insuranceCoverage"
                        name="insuranceCoverage"
                        checked={warehouseDetails.insuranceCoverage}
                        onCheckedChange={(checked) =>
                          handleWarehouseChange({
                            target: { name: "insuranceCoverage", type: "checkbox", checked },
                          } as any)
                        }
                        className="border-neutral-800 data-[state=checked]:bg-neutral-700"
                      />
                      <Label htmlFor="insuranceCoverage" className="text-neutral-200">Insurance Coverage</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="temperatureControl" className="text-neutral-200">Temperature Control</Label>
                      <Input
                        id="temperatureControl"
                        name="temperatureControl"
                        value={warehouseDetails.temperatureControl}
                        onChange={handleWarehouseChange}
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                        placeholder="Temperature Control Details"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="securityFeatures" className="text-neutral-200">Security Features</Label>
                      <Input
                        id="securityFeatures"
                        name="securityFeatures"
                        value={warehouseDetails.securityFeatures}
                        onChange={handleWarehouseChange}
                        className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                        placeholder="Security Features"
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="flex justify-end pt-4 border-t border-neutral-800">
                <Button
                  type="submit"
                  className="bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Warehouse
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {warehouses.length > 0 && (
        <Card className="bg-black/95 border border-neutral-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Warehouse Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {warehouses.map((warehouse) => (
                <AccordionItem key={warehouse.id} value={`item-${warehouse.id}`}>
                  <AccordionTrigger>{warehouse.darkStoreName}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>
                        <strong>Size:</strong> {warehouse.warehouseSize} sq.ft
                      </p>
                      <p>
                        <strong>Ceiling Height:</strong> {warehouse.ceilingHeight} ft
                      </p>
                      <p>
                        <strong>Address:</strong> {warehouse.warehouseAddress}
                      </p>
                      <p>
                        <strong>Storage Capacity:</strong> {warehouse.storageCapacity}
                      </p>
                      <p>
                        <strong>Loading Dock:</strong> {warehouse.loadingDock ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Power Backup:</strong> {warehouse.powerBackup ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Temperature Control:</strong> {warehouse.temperatureControl}
                      </p>
                      <p>
                        <strong>Security Features:</strong> {warehouse.securityFeatures}
                      </p>
                      <p>
                        <strong>Operational Hours:</strong> {warehouse.operationalHours}
                      </p>
                      <p>
                        <strong>Accessibility:</strong> {warehouse.accessibility}
                      </p>
                      <p>
                        <strong>Available Facilities:</strong> {warehouse.availableFacilities}
                      </p>
                      <p>
                        <strong>Insurance Coverage:</strong> {warehouse.insuranceCoverage ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Fire Safety Compliance:</strong> {warehouse.fireSafetyCompliance}
                      </p>
                      <p>
                        <strong>Year of Establishment:</strong> {warehouse.yearOfEstablishment}
                      </p>
                      <p>
                        <strong>Certifications:</strong> {warehouse.certifications}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}