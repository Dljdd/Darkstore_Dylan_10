'use client';

import React, { useState, useEffect } from 'react';
import { ref, onValue, set, update } from 'firebase/database';
import { database } from '@/firebase'; // Make sure this path is correct
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WarehouseIcon, Package, Ruler, Calendar, MapPin, Clock, Shield, Thermometer, Truck, Check, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ApplicationStatus = 'pending' | 'approved' | 'rejected';

type NotificationData = {
  show: boolean;
  title: string;
  message: string;
  isError: boolean;
};

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
  applications: Record<string, ApplicationStatus>;
};

const Settings = () => {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationData>({
    show: false,
    title: '',
    message: '',
    isError: false,
  });
  
  const deliveryServices = [
    'Swiggy Instamart',
    'Blinkit',
    'Zepto',
    'JioMart',
    'Big Basket'
  ];

  useEffect(() => {
    const warehousesRef = ref(database, 'warehouses');
    onValue(warehousesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const warehouseList = Object.entries(data).map(([key, value]) => ({
          ...(value as WarehouseData),
          applications: (value as WarehouseData).applications || {}
        }));
        setWarehouses(warehouseList);
      }
    });
  }, []);

  const handleApplyAsDarkstore = async (warehouseId: string, service: string) => {
    try {
      setIsSubmitting(true);
      const warehouseRef = ref(database, `warehouses/${warehouseId}`);
      
      // Get the current warehouse data
      const currentWarehouse = warehouses.find(w => w.id === warehouseId);
      if (!currentWarehouse) throw new Error('Warehouse not found');

      // Create updated applications object
      const updatedApplications: Record<string, ApplicationStatus> = {
        ...(currentWarehouse.applications || {}),
        [service]: 'pending' as ApplicationStatus
      };

      // Update Firebase with the new application status
      await update(warehouseRef, {
        applications: updatedApplications
      });

      // Update local state
      setWarehouses(prevWarehouses => 
        prevWarehouses.map(w => 
          w.id === warehouseId 
            ? { ...w, applications: updatedApplications }
            : w
        )
      );

      // Show success notification
      setNotification({
        show: true,
        title: 'Application Submitted',
        message: `Your application for ${service} has been submitted successfully.`,
        isError: false,
      });

    } catch (error) {
      // Show error notification
      setNotification({
        show: true,
        title: 'Error',
        message: 'Failed to submit application. Please try again.',
        isError: true,
      });
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const getStatusColor = (status: ApplicationStatus | undefined) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-200';
      case 'approved':
        return 'bg-green-600/20 text-green-200';
      case 'rejected':
        return 'bg-red-600/20 text-red-200';
      default:
        return 'hover:bg-primary/20';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Dialog open={notification.show} onOpenChange={closeNotification}>
        <DialogContent className={`${notification.isError ? 'border-red-500' : 'border-green-500'} border-2`}>
          <DialogHeader>
            <DialogTitle className={`${notification.isError ? 'text-red-500' : 'text-green-500'}`}>
              {notification.title}
            </DialogTitle>
            <DialogDescription>
              {notification.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={closeNotification} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-12 pt-8 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Warehouses
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your warehouse locations and applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {warehouses
          .filter((warehouse) => warehouse.darkStoreName)
          .map((warehouse) => (
            <Card key={warehouse.id} className="overflow-hidden">
              <CardHeader className="bg-secondary">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{warehouse.darkStoreName}</span>
                    {warehouse.applications && Object.values(warehouse.applications).some(status => status === 'pending') && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 px-2 py-1">
                        Pending Approval
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Apply as Darkstore"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      {deliveryServices.map((service) => {
                        const hasApplied = warehouse.applications && service in warehouse.applications;
                        return (
                          <DropdownMenuItem
                            key={service}
                            onClick={() => !hasApplied && handleApplyAsDarkstore(warehouse.id, service)}
                            disabled={hasApplied || isSubmitting}
                            className={`
                              flex items-center justify-between
                              ${hasApplied ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary/10'}
                            `}
                          >
                            <span>{service}</span>
                            {hasApplied && (
                              <Badge 
                                variant="outline" 
                                className="ml-2 bg-primary/20 text-primary text-xs"
                              >
                                Applied
                              </Badge>
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
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