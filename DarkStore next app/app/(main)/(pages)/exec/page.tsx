'use client';

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebase'; // Make sure this path is correct
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WarehouseIcon, Package, Ruler, Calendar, MapPin, Clock, Shield, Thermometer, Truck, Check, X } from "lucide-react";

type WarehouseData = {
  id: string;
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
  isActive: boolean;
};

const Settings = () => {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);

  useEffect(() => {
    const warehousesRef = ref(database, 'warehouses');
    onValue(warehousesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const warehouseList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as WarehouseData),
        }));
        setWarehouses(warehouseList);
      }
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 flex items-center">
        <WarehouseIcon className="mr-2 h-8 w-8" />
        Warehouses
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {warehouses
          .filter((warehouse) => warehouse.darkStoreName)
          .map((warehouse) => (
            <Card key={warehouse.id} className="overflow-hidden">
              <CardHeader className="bg-secondary">
                <CardTitle className="flex justify-between items-center">
                  <span>{warehouse.darkStoreName}</span>
                  <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                    {warehouse.isActive ? 'Approved' : 'Pending'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="font-medium">{warehouse.warehouseSize} sq.ft</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ceiling Height</p>
                      <p className="font-medium">{warehouse.ceilingHeight}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Established</p>
                      <p className="font-medium">{warehouse.yearOfEstablishment}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium truncate">{warehouse.warehouseAddress}</p>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details">
                    <AccordionTrigger>View Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <Truck className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Storage Capacity</p>
                            <p className="text-sm text-muted-foreground">{warehouse.storageCapacity}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Operational Hours</p>
                            <p className="text-sm text-muted-foreground">{warehouse.operationalHours}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Thermometer className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Temperature Control</p>
                            <p className="text-sm text-muted-foreground">{warehouse.temperatureControl}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Shield className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Security Features</p>
                            <p className="text-sm text-muted-foreground">{warehouse.securityFeatures}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm"><strong>Accessibility:</strong> {warehouse.accessibility}</p>
                        <p className="text-sm"><strong>Available Facilities:</strong> {warehouse.availableFacilities}</p>
                        <p className="text-sm"><strong>Fire Safety Compliance:</strong> {warehouse.fireSafetyCompliance}</p>
                        <p className="text-sm"><strong>Certifications:</strong> {warehouse.certifications}</p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm" className={`${warehouse.loadingDock ? 'bg-primary text-primary-foreground' : ''}`}>
                          {warehouse.loadingDock ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
                          Loading Dock
                        </Button>
                        <Button variant="outline" size="sm" className={`${warehouse.powerBackup ? 'bg-primary text-primary-foreground' : ''}`}>
                          {warehouse.powerBackup ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
                          Power Backup
                        </Button>
                        <Button variant="outline" size="sm" className={`${warehouse.insuranceCoverage ? 'bg-primary text-primary-foreground' : ''}`}>
                          {warehouse.insuranceCoverage ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
                          Insured
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Settings;