import { NextResponse } from 'next/server';

// Simple global storage for development
global.mockStorage = global.mockStorage || new Map();
global.mockCounter = global.mockCounter || 0;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name');
    const description = formData.get('description');

    console.log('Upload request:', { name, description, fileName: file?.name });

    if (!file || !name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock image upload
    const imageHash = `mock_image_${global.mockCounter++}`;
    const imageUrl = `http://localhost:3000/api/ipfs/${imageHash}`;
    
    // Store file data
    const buffer = await file.arrayBuffer();
    global.mockStorage.set(imageHash, {
      buffer,
      type: file.type,
      name: file.name
    });

    // Create metadata
    const metadata = {
      name,
      description,
      image: imageUrl,
      attributes: []
    };

    // Mock metadata upload
    const metadataHash = `mock_metadata_${global.mockCounter++}`;
    const metadataUrl = `http://localhost:3000/api/ipfs/${metadataHash}`;
    
    global.mockStorage.set(metadataHash, {
      data: JSON.stringify(metadata),
      type: 'application/json'
    });

    console.log('Upload successful:', {
      imageUrl,
      metadataUrl,
      imageHash,
      metadataHash
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      metadataUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}