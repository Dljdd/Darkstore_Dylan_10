'use client'

import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Package, Users, ShoppingCart, Activity, Download, Bell, FileText, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ComposedChart } from 'recharts'
import LowStockCard from "@/components/inventory/LowStockCard"

interface RecentProduct {
  name: string
  sku: string
  amount: number
  image: string
  category: string
  stock: number
  supplier: string
  lastRestocked: string
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

interface Report {
  id: number;
  name: string;
  date: string;
  status: string;
  type: string;
  insights: string;
}

const recentProducts: RecentProduct[] = [
  {
    name: "Apple iPhone 15 Pro (256GB)",
    sku: "APPL-IP15P-256",
    amount: 1299000.00,
    image: "/products/iphone.jpg",
    category: "Electronics",
    stock: 45,
    supplier: "Apple India Pvt Ltd",
    lastRestocked: "2024-01-25",
    status: "In Stock"
  },
  {
    name: "Samsung 65\" QLED 4K TV",
    sku: "SMSNG-TV65-4K",
    amount: 1499000.00,
    image: "/products/tv.jpg",
    category: "Electronics",
    stock: 12,
    supplier: "Samsung Electronics",
    lastRestocked: "2024-01-20",
    status: "Low Stock"
  },
  {
    name: "Nike Air Jordan 1 High",
    sku: "NIKE-AJ1H-001",
    amount: 14995.00,
    image: "/products/nike.jpg",
    category: "Footwear",
    stock: 0,
    supplier: "Nike India",
    lastRestocked: "2024-01-15",
    status: "Out of Stock"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    sku: "SONY-WH5-BLK",
    amount: 29990.00,
    image: "/products/sony.jpg",
    category: "Electronics",
    stock: 28,
    supplier: "Sony India",
    lastRestocked: "2024-01-28",
    status: "In Stock"
  },
  {
    name: "MacBook Pro 16\" M3 Max",
    sku: "APPL-MBP16-M3",
    amount: 2999000.00,
    image: "/products/macbook.jpg",
    category: "Electronics",
    stock: 8,
    supplier: "Apple India Pvt Ltd",
    lastRestocked: "2024-01-22",
    status: "Low Stock"
  }
]

const categoryData = [
  { name: 'Electronics', value: 1250000, growth: '+15%' },
  { name: 'Footwear', value: 850000, growth: '+8%' },
  { name: 'Apparel', value: 720000, growth: '+12%' },
  { name: 'Accessories', value: 480000, growth: '+5%' },
  { name: 'Home & Living', value: 350000, growth: '+10%' },
  { name: 'Beauty', value: 280000, growth: '+18%' }
]

const salesData = [
  { name: 'Week 1', sales: 38000000, returns: 950000, profit: 7200000 },
  { name: 'Week 2', sales: 42000000, returns: 1100000, profit: 7900000 },
  { name: 'Week 3', sales: 52000000, returns: 1500000, profit: 9800000 },
  { name: 'Week 4', sales: 42000000, returns: 1100000, profit: 7900000 },
  { name: 'Week 5', sales: 48000000, returns: 1300000, profit: 9100000 },
  { name: 'Week 6', sales: 55000000, returns: 1600000, profit: 10500000 }
]

const monthlyData = [
  { name: 'Jan', revenue: 420000000, expenses: 280000000, profit: 140000000, growth: '+12%' },
  { name: 'Feb', revenue: 380000000, expenses: 250000000, profit: 130000000, growth: '+8%' },
  { name: 'Mar', revenue: 450000000, expenses: 300000000, profit: 150000000, growth: '+15%' },
  { name: 'Apr', revenue: 410000000, expenses: 270000000, profit: 140000000, growth: '+10%' },
  { name: 'May', revenue: 390000000, expenses: 260000000, profit: 130000000, growth: '+7%' },
  { name: 'Jun', revenue: 440000000, expenses: 290000000, profit: 150000000, growth: '+14%' },
  { name: 'Jul', revenue: 470000000, expenses: 310000000, profit: 160000000, growth: '+16%' },
  { name: 'Aug', revenue: 460000000, expenses: 300000000, profit: 160000000, growth: '+15%' },
  { name: 'Sep', revenue: 430000000, expenses: 280000000, profit: 150000000, growth: '+13%' },
  { name: 'Oct', revenue: 450000000, expenses: 290000000, profit: 160000000, growth: '+14%' },
  { name: 'Nov', revenue: 480000000, expenses: 310000000, profit: 170000000, growth: '+17%' },
  { name: 'Dec', revenue: 520000000, expenses: 340000000, profit: 180000000, growth: '+20%' }
]

const analyticsData = [
  { 
    name: 'Week 1',
    totalItems: 4700,
    activeItems: 4200,
    discontinuedItems: 500,
    stockStatus: {
      optimal: 3500,
      excess: 700,
      low: 320,
      critical: 180
    },
    metrics: {
      turnoverRate: 12.5,
      stockoutRate: 3.8,
      inventoryAccuracy: 98.2,
      daysOfSupply: 45
    },
    performance: {
      pickingAccuracy: 99.1,
      orderFulfillmentRate: 96.5,
      returnRate: 2.3
    },
    value: {
      totalValue: 85000000,
      averageItemValue: 18085,
      holdingCost: 4250000
    }
  },
  { 
    name: 'Week 2',
    totalItems: 4300,
    activeItems: 3800,
    discontinuedItems: 500,
    stockStatus: {
      optimal: 3200,
      excess: 600,
      low: 280,
      critical: 220
    },
    metrics: {
      turnoverRate: 11.8,
      stockoutRate: 5.1,
      inventoryAccuracy: 97.8,
      daysOfSupply: 42
    },
    performance: {
      pickingAccuracy: 98.7,
      orderFulfillmentRate: 95.8,
      returnRate: 2.5
    },
    value: {
      totalValue: 78000000,
      averageItemValue: 18139,
      holdingCost: 3900000
    }
  }
]

const initialReportsData = [
  { 
    id: 1, 
    name: 'Q4 2024 Inventory Valuation Report', 
    date: '2024-12-31', 
    status: 'Generated',
    type: 'Financial',
    insights: 'Total inventory value: ₹8.5Cr (+15% QoQ). Optimal stock levels maintained at 74%. Holding costs reduced by 8%.'
  },
  { 
    id: 2, 
    name: 'Electronics Category Deep Dive', 
    date: '2024-12-30', 
    status: 'Generated',
    type: 'Analytics',
    insights: 'Smartphones lead category growth (+22%). Apple products showing 96% fulfillment rate. Average item value: ₹18,085.'
  },
  { 
    id: 3, 
    name: 'Weekly Stock Movement Analysis', 
    date: '2024-12-29', 
    status: 'Generated',
    type: 'Operations',
    insights: 'Turnover rate improved to 12.5%. Critical stock items reduced by 15%. Pick accuracy at 99.1%.'
  },
  { 
    id: 4, 
    name: 'Top Supplier Performance Review', 
    date: '2024-12-28', 
    status: 'Generated',
    type: 'Vendor',
    insights: 'On-time delivery: 94%. Quality acceptance rate: 98.2%. Average lead time: 12 days.'
  },
  {
    id: 5,
    name: 'Q1 2025 Demand Forecast',
    date: '2024-12-27',
    status: 'Generated',
    type: 'Planning',
    insights: 'Projected 30% demand increase. Key drivers: new product launches, seasonal trends. Recommended stock increase: 25%.'
  },
  {
    id: 6,
    name: 'Inventory Optimization Recommendations',
    date: '2024-12-26',
    status: 'Generated',
    type: 'Analytics',
    insights: 'Excess stock in 3 categories. Opportunity to reduce holding costs by ₹425K. 15 SKUs flagged for review.'
  },
  {
    id: 7,
    name: 'Returns & Quality Analysis',
    date: '2024-12-25',
    status: 'Generated',
    type: 'Operations',
    insights: 'Return rate: 2.3%. Main reasons: size issues (45%), damage (30%). Customer satisfaction score: 4.2/5.'
  },
  {
    id: 8,
    name: 'Warehouse Space Utilization',
    date: '2024-12-24',
    status: 'Pending',
    type: 'Operations',
    insights: 'Current utilization: 82%. Peak season capacity planning needed. Recommended layout optimization for 15% more space.'
  },
  {
    id: 9,
    name: 'Cross-Docking Efficiency Report',
    date: '2024-12-23',
    status: 'Generated',
    type: 'Operations',
    insights: 'Average processing time: 4.2 hours. 92% same-day dispatch rate. Labor efficiency improved by 18%.'
  },
  {
    id: 10,
    name: 'Inventory Aging Analysis',
    date: '2024-12-22',
    status: 'Generated',
    type: 'Financial',
    insights: '15% stock over 90 days. Slow-moving SKUs identified in fashion category. Markdown recommendations provided.'
  },
  {
    id: 11,
    name: 'Supply Chain Risk Assessment',
    date: '2024-12-21',
    status: 'Pending',
    type: 'Planning',
    insights: 'Medium risk identified in 3 supplier regions. Contingency plans updated. Buffer stock recommendations included.'
  },
  {
    id: 12,
    name: 'Sustainability Metrics Report',
    date: '2024-12-20',
    status: 'Generated',
    type: 'Environmental',
    insights: 'Packaging waste reduced by 25%. Carbon footprint down 12%. 80% suppliers meeting sustainability criteria.'
  },
  {
    id: 13,
    name: 'ABC Analysis Update',
    date: '2024-12-19',
    status: 'Generated',
    type: 'Analytics',
    insights: 'A-items: 20% of SKUs (80% value). B-items: 30% of SKUs (15% value). C-items: 50% of SKUs (5% value).'
  },
  {
    id: 14,
    name: 'New Product Introduction Impact',
    date: '2024-12-18',
    status: 'Pending',
    type: 'Planning',
    insights: '12 new SKUs launched. Average time to optimal stock: 14 days. First month turnover rate: 15%.'
  },
  {
    id: 15,
    name: 'Peak Season Readiness Assessment',
    date: '2024-12-17',
    status: 'Generated',
    type: 'Planning',
    insights: 'Capacity utilization forecast: 95%. Additional temporary storage secured. Staff augmentation plan in place.'
  }
]

// Notifications data
const initialNotificationsData = [
  { id: 1, message: 'Product A is running low on stock', type: 'warning', time: '2 hours ago' },
  { id: 2, message: 'New shipment arrived for Product B', type: 'success', time: '4 hours ago' },
  { id: 3, message: 'Product C is out of stock', type: 'error', time: '1 day ago' },
  { id: 4, message: 'Inventory count completed', type: 'info', time: '2 days ago' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

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
        status: 'Pending',
        type: 'Inventory',
        insights: 'Pending analysis'
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

      const getReportContent = (report: Report): string => {
        const currentTime = new Date().toISOString();
        const header = `
=======================================================
${report.name.toUpperCase()}
=======================================================
Generated: ${currentTime}
Report ID: ${report.id}
Type: ${report.type}
Status: ${report.status}
=======================================================\n`;

        let specificContent = '';
        
        switch (report.type) {
          case 'Financial':
            specificContent = `
FINANCIAL METRICS
----------------
Total Inventory Value: ₹8,500,000
Monthly Change: +15%
Holding Costs: ₹425,000
Average Item Value: ₹1,808.51

INVENTORY AGING
--------------
0-30 days: 45% (₹3,825,000)
31-60 days: 30% (₹2,550,000)
61-90 days: 10% (₹850,000)
>90 days: 15% (₹1,275,000)

COST BREAKDOWN
-------------
Storage Costs: ₹215,000
Insurance: ₹85,000
Handling: ₹95,000
Other Costs: ₹30,000

RECOMMENDATIONS
--------------
1. Review slow-moving items in 90+ days category
2. Optimize storage space utilization
3. Consider bulk storage options for high-volume items`;
            break;

          case 'Operations':
            specificContent = `
OPERATIONAL METRICS
------------------
Stock Status:
- Optimal Stock: 3,500 items
- Excess Stock: 700 items
- Low Stock: 320 items
- Critical Stock: 180 items

EFFICIENCY METRICS
-----------------
Picking Accuracy: 99.1%
Order Fulfillment Rate: 96.5%
Processing Time: 4.2 hours average
Same-day Dispatch Rate: 92%

WAREHOUSE UTILIZATION
--------------------
Current Capacity: 82%
Available Space: 18%
Total SKUs: 4,700
Active SKUs: 4,200

PERFORMANCE INDICATORS
--------------------
Labor Efficiency: +18%
Equipment Utilization: 85%
Error Rate: 0.9%
Returns Processing: 2.3 days average`;
            break;

          case 'Analytics':
            specificContent = `
CATEGORY PERFORMANCE
-------------------
Top Performing:
1. Electronics: +22% growth
2. Home & Living: +18% growth
3. Fashion: +15% growth

ABC ANALYSIS
-----------
A Items (80% value):
- SKU count: 940 (20%)
- Value: ₹6,800,000
- Turnover: 15.2 times/year

B Items (15% value):
- SKU count: 1,410 (30%)
- Value: ₹1,275,000
- Turnover: 8.5 times/year

C Items (5% value):
- SKU count: 2,350 (50%)
- Value: ₹425,000
- Turnover: 3.2 times/year

TREND ANALYSIS
-------------
Stock Turnover Rate: 12.5 (↑ from 11.8)
Stockout Rate: 3.8% (↓ from 4.2%)
Inventory Accuracy: 98.2%`;
            break;

          case 'Planning':
            specificContent = `
DEMAND FORECAST
--------------
Next Quarter Projection: +30% growth
Key Growth Drivers:
1. New Product Launches: 12 SKUs
2. Seasonal Trends: Summer Collection
3. Market Expansion: 2 new regions

INVENTORY PLANNING
-----------------
Recommended Stock Levels:
- Fast-moving items: +25%
- Seasonal items: +40%
- Regular items: +15%

RISK ASSESSMENT
-------------
Supply Chain Risks:
- Region A: Medium Risk (Political)
- Region B: Low Risk
- Region C: Medium Risk (Logistics)

ACTION ITEMS
-----------
1. Increase buffer stock for critical items
2. Implement new supplier onboarding
3. Update safety stock levels
4. Review lead times for key products`;
            break;

          case 'Environmental':
            specificContent = `
SUSTAINABILITY METRICS
--------------------
Waste Reduction:
- Packaging: -25%
- Product Damage: -15%
- Returns Processing: -20%

Carbon Footprint:
- Warehouse Operations: -12%
- Transportation: -8%
- Overall Reduction: -10%

SUPPLIER COMPLIANCE
-----------------
Environmental Standards:
- Fully Compliant: 80%
- Partially Compliant: 15%
- Non-Compliant: 5%

GREEN INITIATIVES
---------------
1. Solar Panel Installation: 45% complete
2. Electric Vehicle Fleet: 30% converted
3. Recycling Program: 85% materials recycled
4. Water Conservation: -20% usage`;
            break;

          default:
            specificContent = `
GENERAL METRICS
--------------
${report.insights}

Additional Notes:
- Report generated as part of regular monitoring
- Data verified by inventory management system
- Recommendations based on current trends`;
        }

        return header + specificContent + `\n
=======================================================
End of Report
=======================================================`;
      };

      const reportContent = getReportContent(report);
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
      <div className="mb-12 pt-8 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Inventory
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your products, stock levels and orders
        </p>
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
                  <h2 className="text-2xl font-bold mt-2">₹9,50,231.89</h2>
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

            <LowStockCard />

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
                    <YAxis 
                      tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid rgb(38, 38, 38)',
                        borderRadius: '6px'
                      }}
                      formatter={(value, name) => [
                        `₹${(value / 1000000).toFixed(1)}M`,
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#0DAB76" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#FF4D6D" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#4361EE" radius={[4, 4, 0, 0]} />
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
                        <p className="text-sm text-neutral-400">{product.sku}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{product.amount.toFixed(2)}</p>
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
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid rgb(38, 38, 38)',
                        borderRadius: '6px'
                      }}
                      formatter={(value, name) => {
                        switch(name) {
                          case 'Optimal Stock':
                          case 'Critical Stock':
                            return [value, `${name} (Items)`];
                          case 'Turnover Rate':
                            return [`${value}%`, name];
                          case 'Order Fulfillment':
                            return [`${value}%`, name];
                          default:
                            return [value, name];
                        }
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey={item => item.stockStatus.optimal}
                      name="Optimal Stock"
                      yAxisId="left"
                      fill="#0DAB76" 
                      barSize={20}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey={item => item.stockStatus.critical}
                      name="Critical Stock"
                      yAxisId="left"
                      fill="#FF4D6D" 
                      barSize={20}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey={item => item.metrics.turnoverRate}
                      name="Turnover Rate"
                      yAxisId="right"
                      fill="#4361EE" 
                      barSize={20}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey={item => item.performance.orderFulfillmentRate}
                      name="Order Fulfillment"
                      yAxisId="right"
                      fill="#4CC9F0" 
                      barSize={20}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
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
