'use client'

import React from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Users, ShoppingCart, Activity, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface RecentProduct {
  name: string
  email: string
  amount: number
  image: string
}

const recentProducts: RecentProduct[] = [
  {
    name: "Product A",
    email: "SKU: PRD-001",
    amount: 1999.00,
    image: "/placeholder.jpg"
  },
  {
    name: "Product B",
    email: "SKU: PRD-002",
    amount: 39.00,
    image: "/placeholder.jpg"
  },
  {
    name: "Product C",
    email: "SKU: PRD-003",
    amount: 299.00,
    image: "/placeholder.jpg"
  },
  {
    name: "Product D",
    email: "SKU: PRD-004",
    amount: 99.00,
    image: "/placeholder.jpg"
  },
  {
    name: "Product E",
    email: "SKU: PRD-005",
    amount: 39.00,
    image: "/placeholder.jpg"
  }
]

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 200 },
  { name: 'Books', value: 100 },
]

const salesData = [
  { name: 'Week 1', sales: 4000 },
  { name: 'Week 2', sales: 3000 },
  { name: 'Week 3', sales: 5000 },
  { name: 'Week 4', sales: 2780 },
  { name: 'Week 5', sales: 1890 },
  { name: 'Week 6', sales: 2390 },
]

const monthlyData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
  { name: 'Aug', value: 4000 },
  { name: 'Sep', value: 2500 },
  { name: 'Oct', value: 3300 },
  { name: 'Nov', value: 2900 },
  { name: 'Dec', value: 3800 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function InventoryPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="bg-black/95 border border-neutral-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black/95 border border-neutral-800 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-400">Total Stock Value</p>
              <h2 className="text-2xl font-bold mt-2">$45,231.89</h2>
              <p className="text-sm text-green-400 mt-1">+20.1% from last month</p>
            </div>
            <Package className="h-5 w-5 text-neutral-400" />
          </div>
        </Card>

        <Card className="bg-black/95 border border-neutral-800 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-400">Products</p>
              <h2 className="text-2xl font-bold mt-2">+2350</h2>
              <p className="text-sm text-green-400 mt-1">+180.1% from last month</p>
            </div>
            <ShoppingCart className="h-5 w-5 text-neutral-400" />
          </div>
        </Card>

        <Card className="bg-black/95 border border-neutral-800 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-400">Low Stock Items</p>
              <h2 className="text-2xl font-bold mt-2">+12,234</h2>
              <p className="text-sm text-red-400 mt-1">+19% from last month</p>
            </div>
            <Activity className="h-5 w-5 text-neutral-400" />
          </div>
        </Card>

        <Card className="bg-black/95 border border-neutral-800 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-400">Suppliers</p>
              <h2 className="text-2xl font-bold mt-2">+573</h2>
              <p className="text-sm text-green-400 mt-1">+20.1 since last hour</p>
            </div>
            <Users className="h-5 w-5 text-neutral-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-black/95 border border-neutral-800 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    border: '1px solid rgb(38, 38, 38)',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {monthlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={`hsl(${index * 30}, 70%, 50%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-black/95 border border-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
          <div className="space-y-6">
            {recentProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-neutral-800" />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-neutral-400">{product.email}</p>
                  </div>
                </div>
                <p className="font-medium">+${product.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-black/95 border border-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-black/95 border border-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Sales Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
