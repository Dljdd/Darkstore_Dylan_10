import React from "react";
import { WarehouseIcon, ChevronDown, ChevronUp, Package, Ruler, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Warehouse {
  id: number;
  darkStoreName: string;
  warehouseSize: string;
  ceilingHeight: string;
  warehouseAddress: string;
  storageCapacity: string;
  loadingDock: boolean;
  powerBackup: boolean;
  temperatureControl: string;
  securityFeatures: string;
  operationalHours: string;
  accessibility: string;
  availableFacilities: string;
  insuranceCoverage: boolean;
  fireSafetyCompliance: string;
  yearOfEstablishment: string;
  certifications: string;
}

interface WarehouseCardProps {
  warehouse: Warehouse;
  toggleDetails: () => void;
  isOpen: boolean;
}

export default function WarehouseCard({ warehouse, toggleDetails, isOpen }: WarehouseCardProps) {
  return (
    <Card className="w-full max-w-2xl transition-all duration-300 ease-in-out hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center">
          <WarehouseIcon className="h-6 w-6 mr-2 text-primary" />
          {warehouse.darkStoreName}
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          ID: {warehouse.id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Size</span>
              <span className="font-medium">{warehouse.warehouseSize} sq.ft</span>
            </div>
          </div>
          <div className="flex items-center">
            <Ruler className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Ceiling Height</span>
              <span className="font-medium">{warehouse.ceilingHeight} ft</span>
            </div>
          </div>
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Storage Capacity</span>
              <span className="font-medium">{warehouse.storageCapacity}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Year Established</span>
              <span className="font-medium">{warehouse.yearOfEstablishment}</span>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={warehouse.loadingDock ? "default" : "secondary"}>
            {warehouse.loadingDock ? "Loading Dock" : "No Loading Dock"}
          </Badge>
          <Badge variant={warehouse.powerBackup ? "default" : "secondary"}>
            {warehouse.powerBackup ? "Power Backup" : "No Power Backup"}
          </Badge>
          <Badge variant={warehouse.insuranceCoverage ? "default" : "secondary"}>
            {warehouse.insuranceCoverage ? "Insured" : "Not Insured"}
          </Badge>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={toggleDetails}
        >
          {isOpen ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" /> Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" /> Show Details
            </>
          )}
        </Button>
        {isOpen && (
          <div className="mt-4 space-y-4">
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Address</span>
                  <span className="text-sm text-muted-foreground">{warehouse.warehouseAddress}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Temperature Control</span>
                <span className="text-sm text-muted-foreground">{warehouse.temperatureControl}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Security Features</span>
                <span className="text-sm text-muted-foreground">{warehouse.securityFeatures}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Operational Hours</span>
                <span className="text-sm text-muted-foreground">{warehouse.operationalHours}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Accessibility</span>
                <span className="text-sm text-muted-foreground">{warehouse.accessibility}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Available Facilities</span>
                <span className="text-sm text-muted-foreground">{warehouse.availableFacilities}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Fire Safety Compliance</span>
                <span className="text-sm text-muted-foreground">{warehouse.fireSafetyCompliance}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Certifications</span>
                <span className="text-sm text-muted-foreground">{warehouse.certifications}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}