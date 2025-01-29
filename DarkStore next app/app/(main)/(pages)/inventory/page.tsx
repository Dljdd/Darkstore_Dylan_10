'use client'

import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Package, Users, ShoppingCart, Activity, Download, Bell, FileText, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'

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

// Analytics data
const analyticsData = [
  { name: 'Week 1', inStock: 4000, outOfStock: 2400, lowStock: 2400 },
  { name: 'Week 2', inStock: 3000, outOfStock: 1398, lowStock: 2210 },
  { name: 'Week 3', inStock: 2000, outOfStock: 9800, lowStock: 2290 },
  { name: 'Week 4', inStock: 2780, outOfStock: 3908, lowStock: 2000 },
];

// Reports data
const initialReportsData = [
  { id: 1, name: 'Monthly Inventory Summary', date: '2024-01-29', status: 'Generated' },
  { id: 2, name: 'Stock Movement Analysis', date: '2024-01-28', status: 'Pending' },
  { id: 3, name: 'Low Stock Alert Report', date: '2024-01-27', status: 'Generated' },
  { id: 4, name: 'Supplier Performance Report', date: '2024-01-26', status: 'Generated' },
];

// Notifications data
const initialNotificationsData = [
  { id: 1, message: 'Product A is running low on stock', type: 'warning', time: '2 hours ago' },
  { id: 2, message: 'New shipment arrived for Product B', type: 'success', time: '4 hours ago' },
  { id: 3, message: 'Product C is out of stock', type: 'error', time: '1 day ago' },
  { id: 4, message: 'Inventory count completed', type: 'info', time: '2 days ago' },
];

export default function InventoryPage() {
  // State management
  const [reports, setReports] = useState(initialReportsData);
  const [notifications, setNotifications] = useState(initialNotificationsData);
  const [isGenerating, setIsGenerating] = useState(false);

  // Analytics Export Handler
  const handleExportAnalytics = async () => {
    try {
      const csvContent = analyticsData.map(row => 
        Object.values(row).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory_analytics.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  // Report Generation Handler
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      const newReport = {
        id: Date.now(),
        name: 'New Inventory Report',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      
      setReports(prev => [newReport, ...prev]);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update report status to Generated
      setReports(prev => prev.map(report => 
        report.id === newReport.id ? { ...report, status: 'Generated' } : report
      ));

      // Add notification for generated report
      const notification = {
        id: Date.now(),
        message: `Report "${newReport.name}" has been generated`,
        type: 'success',
        time: 'Just now'
      };
      setNotifications(prev => [notification, ...prev]);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Report Download Handler
  const handleDownloadReport = async (reportId: number) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report || report.status !== 'Generated') return;

      // Create a sample report content (replace with actual report data)
      const reportContent = `
        Inventory Report
        Name: ${report.name}
        Date: ${report.date}
        Generated: ${new Date().toISOString()}
        
        This is a sample report content.
        Replace with actual report data.
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.toLowerCase().replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  // Notification Handlers
  const handleDismissNotification = (notificationId: number) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

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

        <TabsContent value="overview">
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
                          fill={['#139A43', '#0DAB76', '#CBFF4D'][index % 3]}
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
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card className="bg-black/95 border border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Analytics Overview</h3>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportAnalytics}>
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
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
                    <Area type="monotone" dataKey="inStock" stackId="1" stroke="#0DAB76" fill="#0DAB76" />
                    <Area type="monotone" dataKey="outOfStock" stackId="1" stroke="#139A43" fill="#139A43" />
                    <Area type="monotone" dataKey="lowStock" stackId="1" stroke="#CBFF4D" fill="#CBFF4D" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="bg-black/95 border border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Reports</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2" 
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                <FileText className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-neutral-800">
                      <FileText className="h-4 w-4 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-neutral-400">{report.date}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => report.status === 'Generated' ? handleDownloadReport(report.id) : null}
                    disabled={report.status !== 'Generated'}
                  >
                    {report.status === 'Generated' ? 'Download' : 'Pending'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-black/95 border border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleMarkAllAsRead}>
                <Bell className="h-4 w-4" />
                Mark All as Read
              </Button>
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-4 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                      notification.type === 'success' ? 'bg-green-500/20 text-green-500' :
                      notification.type === 'error' ? 'bg-red-500/20 text-red-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-neutral-400">{notification.time}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDismissNotification(notification.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
