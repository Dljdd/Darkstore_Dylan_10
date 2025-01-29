import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('API received:', body);

    const response = await fetch('http://127.0.0.1:8000/cost-benefit-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: body.latitude,
        longitude: body.longitude
      })
    });

    const data = await response.json();
    console.log('Python API returned:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to calculate zone score' }, { status: 500 });
  }
}
