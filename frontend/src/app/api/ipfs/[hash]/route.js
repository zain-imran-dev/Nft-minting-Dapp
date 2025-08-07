import { NextResponse } from 'next/server';

// Access the same global storage
global.mockStorage = global.mockStorage || new Map();

export async function GET(request, { params }) {
  try {
    // Await params before using it (Next.js 15 requirement)
    const { hash } = await params;
    
    console.log('IPFS GET request for hash:', hash);
    console.log('Available hashes:', Array.from(global.mockStorage.keys()));
    
    // Get data from mock storage
    const data = global.mockStorage.get(hash);
    
    if (!data) {
      console.log('Hash not found in storage:', hash);
      return NextResponse.json(
        { error: 'Hash not found' },
        { status: 404 }
      );
    }

    console.log('Found data for hash:', hash);

    // Return JSON data for metadata
    if (data.type === 'application/json') {
      return new NextResponse(data.data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Return file data for images
    if (data.buffer) {
      return new NextResponse(data.buffer, {
        headers: {
          'Content-Type': data.type,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid data format' },
      { status: 500 }
    );

  } catch (error) {
    console.error('IPFS GET error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}