import { NextRequest, NextResponse } from 'next/server';
import { getNotificationService } from '@/lib/notification';
import { z } from 'zod';

// Validation schemas
const phoneNumberSchema = z.string().regex(/^\+[1-9]\d{1,14}$/);

const notificationPreferencesSchema = z.object({
  phoneNumber: phoneNumberSchema,
  smsEnabled: z.boolean().default(true),
  customThresholds: z.record(z.string(), z.number()).optional(),
  notificationFrequency: z.enum(['immediate', 'daily', 'weekly']).default('immediate'),
});

const lowStockAlertSchema = z.object({
  phoneNumber: phoneNumberSchema,
  productName: z.string(),
  currentStock: z.number(),
  warehouseLocation: z.string(),
  avgMonthlyDemand: z.number().optional(),
  threshold: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validatedData = lowStockAlertSchema.parse(data);
    
    const notificationService = getNotificationService();
    const reorderQuantity = validatedData.avgMonthlyDemand 
      ? notificationService.calculateReorderQuantity(validatedData.avgMonthlyDemand)
      : Math.max(50, validatedData.threshold * 2);

    // Get current date and time for the template
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    const result = await notificationService.sendWhatsAppAlert(
      validatedData.phoneNumber,
      {
        productName: validatedData.productName,
        currentStock: validatedData.currentStock,
        warehouseLocation: validatedData.warehouseLocation,
        reorderQuantity,
        threshold: validatedData.threshold,
        date,
        time
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('Error in notifications route:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
