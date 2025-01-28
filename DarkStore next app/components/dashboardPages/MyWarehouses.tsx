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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-8">My Warehouses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{warehouse.darkStoreName}</CardTitle>
              <Warehouse className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouse.warehouseSize} sq.ft</div>
              <p className="text-xs text-gray-400">{warehouse.warehouseAddress}</p>
            </CardContent>
          </Card>
        ))}
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => setShowForm(true)}>
          <CardHeader className="flex flex-row items-center justify-center h-full">
            <Plus className="h-12 w-12 text-blue-400" />
          </CardHeader>
        </Card>
      </div>
      {showForm && (
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Add New Warehouse</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWarehouseSubmit} className="space-y-4">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="darkStoreName">Dark Store Name</Label>
                      <Input
                        id="darkStoreName"
                        name="darkStoreName"
                        value={warehouseDetails.darkStoreName}
                        onChange={handleWarehouseChange}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Enter Dark Store Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warehouseSize">Warehouse Size (sq.ft)</Label>
                      <Input
                        type="number"
                        id="warehouseSize"
                        name="warehouseSize"
                        value={warehouseDetails.warehouseSize}
                        onChange={handleWarehouseChange}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Enter Warehouse Size"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ceilingHeight">Ceiling Height</Label>
                      <Input
                        type="number"
                        id="ceilingHeight"
                        name="ceilingHeight"
                        value={warehouseDetails.ceilingHeight}
                        onChange={handleWarehouseChange}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Enter Ceiling Height"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storageCapacity">Storage Capacity (pallets/shelves)</Label>
                      <Input
                        type="number"
                        id="storageCapacity"
                        name="storageCapacity"
                        value={warehouseDetails.storageCapacity}
                        onChange={handleWarehouseChange}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Enter Storage Capacity"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouseAddress">Warehouse Address</Label>
                    <Input
                      id="warehouseAddress"
                      name="warehouseAddress"
                      value={warehouseDetails.warehouseAddress}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Enter Warehouse Address"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="loadingDock"
                        name="loadingDock"
                        checked={warehouseDetails.loadingDock}
                        onCheckedChange={(checked) =>
                          setWarehouseDetails((prev) => ({ ...prev, loadingDock: checked as boolean }))
                        }
                      />
                      <Label htmlFor="loadingDock">Loading Dock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="powerBackup"
                        name="powerBackup"
                        checked={warehouseDetails.powerBackup}
                        onCheckedChange={(checked) =>
                          setWarehouseDetails((prev) => ({ ...prev, powerBackup: checked as boolean }))
                        }
                      />
                      <Label htmlFor="powerBackup">Power Backup</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperatureControl">Temperature Control</Label>
                    <Input
                      id="temperatureControl"
                      name="temperatureControl"
                      value={warehouseDetails.temperatureControl}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="e.g., ambient, refrigerated, frozen"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="securityFeatures">Security Features</Label>
                    <Input
                      id="securityFeatures"
                      name="securityFeatures"
                      value={warehouseDetails.securityFeatures}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="e.g., CCTV, 24/7 security"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operationalHours">Operational Hours</Label>
                    <Input
                      id="operationalHours"
                      name="operationalHours"
                      value={warehouseDetails.operationalHours}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Enter Operational Hours"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessibility">Accessibility</Label>
                    <Input
                      id="accessibility"
                      name="accessibility"
                      value={warehouseDetails.accessibility}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="e.g., parking, ramp access"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availableFacilities">Available Facilities</Label>
                    <Input
                      id="availableFacilities"
                      name="availableFacilities"
                      value={warehouseDetails.availableFacilities}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="e.g., restrooms, break rooms"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insuranceCoverage"
                      name="insuranceCoverage"
                      checked={warehouseDetails.insuranceCoverage}
                      onCheckedChange={(checked) =>
                        setWarehouseDetails((prev) => ({ ...prev, insuranceCoverage: checked as boolean }))
                      }
                    />
                    <Label htmlFor="insuranceCoverage">Insurance Coverage</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fireSafetyCompliance">Fire Safety Compliance</Label>
                    <Input
                      id="fireSafetyCompliance"
                      name="fireSafetyCompliance"
                      value={warehouseDetails.fireSafetyCompliance}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Enter Fire Safety Compliance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearOfEstablishment">Year of Establishment</Label>
                    <Input
                      id="yearOfEstablishment"
                      name="yearOfEstablishment"
                      value={warehouseDetails.yearOfEstablishment}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Enter Year of Establishment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Input
                      id="certifications"
                      name="certifications"
                      value={warehouseDetails.certifications}
                      onChange={handleWarehouseChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="e.g., FSSAI, ISO"
                    />
                  </div>
                </div>
              </ScrollArea>
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Add Warehouse
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      {warehouses.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Warehouse Details</CardTitle>
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
                        <strong>Loading Dock:</strong> {warehouse.loadingDock ?   "Yes" : "No"}
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