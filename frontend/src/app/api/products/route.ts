import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the backend API
    const response = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authentication cookies if present
        ...(request.headers.get('cookie') ? { 'Cookie': request.headers.get('cookie')! } : {})
      },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    if (response.ok) {
      return NextResponse.json({ success: true, ...data }, { status: response.status });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Error creating product' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in products API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products
 * Get all products
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `http://localhost:3001/api/products${queryString ? `?${queryString}` : ''}`;
    
    // Forward the request to the backend API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward authentication cookies if present
        ...(request.headers.get('cookie') ? { 'Cookie': request.headers.get('cookie')! } : {})
      },
      credentials: 'include'
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    if (response.ok) {
      return NextResponse.json(data, { status: response.status });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Error fetching products' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in products API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
