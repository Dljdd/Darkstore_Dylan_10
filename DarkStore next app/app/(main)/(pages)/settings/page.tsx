'use client';
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebase'; // Make sure this path is correct
import data from '@/data.json'; // Import the warehouse data

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
};

type Props = {}

const Settings = (props: Props) => {
  const [filterBy, setFilterBy] = useState<string>(''); // State for filter
  const [sortBy, setSortBy] = useState<string>(''); // State for sort
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);

  // Effect to handle fetching warehouse data from Firebase
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

  // Effect to handle filtering and sorting whenever filter or sort changes
  useEffect(() => {
    let filtered = [...warehouses];

    // Apply the filter based on the selected "Filter By" option
    if (filterBy === 'darkStoreName') {
      filtered = filtered.sort((a, b) => a.darkStoreName.localeCompare(b.darkStoreName));
    }

    // Apply sorting based on the "Sort By" option
    if (sortBy === 'ascending' || sortBy === 'descending') {
      const isAscending = sortBy === 'ascending';

      // Handle sorting based on filter type
      if (filterBy === 'warehouseSize') {
        filtered = filtered.sort((a, b) =>
          isAscending
            ? parseInt(a.warehouseSize) - parseInt(b.warehouseSize)
            : parseInt(b.warehouseSize) - parseInt(a.warehouseSize)
        );
      } else if (filterBy === 'warehouseAddress') {
        filtered = filtered.sort((a, b) =>
          isAscending ? a.warehouseAddress.localeCompare(b.warehouseAddress) : b.warehouseAddress.localeCompare(a.warehouseAddress)
        );
      }
    }

    // Update the filtered data
    setWarehouses(filtered);
  }, [filterBy, sortBy]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>

      {/* Dropdowns for Filter By and Sort By */}
      <div className="flex gap-4 p-4">
        <div className="flex flex-col">
          <label htmlFor="filter" className="text-lg font-semibold">Filter By</label>
          <select
            id="filter"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Select a filter</option>
            <option value="darkStoreName">Dark Store Name (Alphabetical)</option>
            <option value="warehouseSize">Warehouse Size</option>
            <option value="warehouseAddress">Warehouse Address</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="sort" className="text-lg font-semibold">Sort By</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Select sorting method</option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-300 p-2">Dark Store Name</th>
              <th className="border border-gray-300 p-2">Warehouse Size</th>
              <th className="border border-gray-300 p-2">Ceiling Height</th>
              <th className="border border-gray-300 p-2">Warehouse Address</th>
              <th className="border border-gray-300 p-2">Storage Capacity</th>
              <th className="border border-gray-300 p-2">Loading Dock</th>
              <th className="border border-gray-300 p-2">Power Backup</th>
              <th className="border border-gray-300 p-2">Temperature Control</th>
              <th className="border border-gray-300 p-2">Security Features</th>
              <th className="border border-gray-300 p-2">Operational Hours</th>
              <th className="border border-gray-300 p-2">Accessibility</th>
              <th className="border border-gray-300 p-2">Available Facilities</th>
              <th className="border border-gray-300 p-2">Insurance Coverage</th>
              <th className="border border-gray-300 p-2">Fire Safety Compliance</th>
              <th className="border border-gray-300 p-2">Year of Establishment</th>
              <th className="border border-gray-300 p-2">Certifications</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr key={warehouse.id}>
                <td className="border border-gray-300 p-2">{warehouse.darkStoreName}</td>
                <td className="border border-gray-300 p-2">{warehouse.warehouseSize}</td>
                <td className="border border-gray-300 p-2">{warehouse.ceilingHeight}</td>
                <td className="border border-gray-300 p-2">{warehouse.warehouseAddress}</td>
                <td className="border border-gray-300 p-2">{warehouse.storageCapacity}</td>
                <td className="border border-gray-300 p-2">{warehouse.loadingDock ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 p-2">{warehouse.powerBackup ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 p-2">{warehouse.temperatureControl}</td>
                <td className="border border-gray-300 p-2">{warehouse.securityFeatures}</td>
                <td className="border border-gray-300 p-2">{warehouse.operationalHours}</td>
                <td className="border border-gray-300 p-2">{warehouse.accessibility}</td>
                <td className="border border-gray-300 p-2">{warehouse.availableFacilities}</td>
                <td className="border border-gray-300 p-2">{warehouse.insuranceCoverage ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 p-2">{warehouse.fireSafetyCompliance}</td>
                <td className="border border-gray-300 p-2">{warehouse.yearOfEstablishment}</td>
                <td className="border border-gray-300 p-2">{warehouse.certifications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Settings;
