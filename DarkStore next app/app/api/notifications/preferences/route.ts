import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const preferencesSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/),
  smsEnabled: z.boolean().optional(),
  customThresholds: z.record(z.string(), z.number()).optional(),
  notificationFrequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validatedData = preferencesSchema.parse(data);

    // Here you would typically save these preferences to your database
    // For demonstration, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: validatedData
    });
  } catch (error) {
    console.error('Error in preferences route:', error);
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

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const validatedData = preferencesSchema.partial().parse(data);

    // Here you would typically update these preferences in your database
    // For demonstration, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: validatedData
    });
  } catch (error) {
    console.error('Error in preferences route:', error);
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
