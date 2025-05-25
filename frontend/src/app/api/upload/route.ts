import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/upload
 * Upload a file to the backend
 */
export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    
    // Forward the request to the backend API
    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
      // Forward authentication cookies if present
      headers: request.headers.get('cookie') 
        ? { 'Cookie': request.headers.get('cookie')! } 
        : {},
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    if (response.ok) {
      return NextResponse.json(data, { status: response.status });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Error uploading file' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in upload API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
