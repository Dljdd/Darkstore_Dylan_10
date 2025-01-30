'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface LowStockItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function LowStockCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([
    { id: 1, name: 'Product A', quantity: 5, price: 500 },
    { id: 2, name: 'Product B', quantity: 3, price: 1000 },
    { id: 3, name: 'Product C', quantity: 2, price: 750 },
  ]);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const handleRestock = async (item: LowStockItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: item.price * 100, // Convert to paise
          currency: 'INR',
          receipt: `restock_${item.id}_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!data.id) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: item.price * 100,
        currency: 'INR',
        name: 'DarkStore',
        description: `Restock ${item.name}`,
        order_id: data.id,
        handler: function (response: any) {
          handlePaymentSuccess(response, item);
        },
        modal: {
          confirm_close: true,
          animation: true,
          backdropClose: false,
          handleBack: true,
          escape: true,
          ondismiss: () => {
            // Handle modal close
          },
          width: '320px',
          height: '500px',
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using Banking methods',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'netbanking' },
                ],
              },
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true,
              show_refresh_button: true
            }
          },
        },
        prefill: {
          name: 'Store Manager',
          email: 'manager@darkstore.com',
        },
        theme: {
          color: '#0DAB76',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  const handlePaymentSuccess = async (response: any, item: LowStockItem) => {
    try {
      // Verify payment on the server
      const verifyResponse = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          item_id: item.id,
        }),
      });

      const verification = await verifyResponse.json();

      if (verification.success) {
        // Update local state to reflect restocked item
        setLowStockItems(prev =>
          prev.map(stockItem =>
            stockItem.id === item.id
              ? { ...stockItem, quantity: stockItem.quantity + 10 }
              : stockItem
          )
        );
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const handleRequestFromOtherStores = (item: LowStockItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNotificationOpen(true);
    setTimeout(() => {
      setIsNotificationOpen(false);
    }, 3000);
  };

  return (
    <Card
      className="p-4 border-none bg-[#1B1B1B] cursor-pointer hover:opacity-70 transition"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-x-3">
        <div className="p-2 w-fit rounded-md bg-red-500/10">
          <Activity className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-red-500">
            Low Stock Alert
          </p>
          <p className="text-sm text-muted-foreground">
            {lowStockItems.length} items below threshold
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Low Stock Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm">
                    Price: ₹{item.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={(e) => handleRestock(item, e)}
                  >
                    Restock
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => handleRequestFromOtherStores(item, e)}
                  >
                    Request from Stores
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Request Sent Successfully</DialogTitle>
          </DialogHeader>
          <p className="text-center text-muted-foreground">
            Message sent, please keep an eye on your inbox
          </p>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
