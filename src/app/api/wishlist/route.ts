import { NextRequest, NextResponse } from 'next/server';
import Wishlist from '@/model/Wishlist';
import dbConnect from '@/lib/db-connect';
import mongoose from 'mongoose';

// GET /api/wishlist
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const wishlistItems = await Wishlist.find({ userId })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ items: wishlistItems });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist items' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received wishlist request body:', body);
    
    const { userId, productId, name, price, image, category } = body;

    // Validate required fields
    if (!userId || !productId || !name || !price || !image || !category) {
      console.log('Missing required fields:', { userId, productId, name, price, image, category });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log('Invalid productId format:', productId);
      return NextResponse.json(
        { error: 'Invalid Product ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      userId,
      productId: new mongoose.Types.ObjectId(productId)
    });

    if (existingItem) {
      console.log('Item already exists in wishlist:', existingItem);
      return NextResponse.json(
        { 
          status: 'success',
          message: 'Item is already in wishlist',
          item: existingItem
        },
        { status: 200 }  // Changed from 400 to 200 since this is not an error
      );
    }

    // Create new wishlist item
    const wishlistItem = await Wishlist.create({
      userId,
      productId: new mongoose.Types.ObjectId(productId),
      name,
      price: Number(price),  // Ensure price is a number
      image,
      category
    });

    console.log('Created wishlist item:', wishlistItem);
    return NextResponse.json({
      status: 'success',
      message: 'Item added to wishlist',
      item: wishlistItem
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          status: 'error',
          error: error.message 
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Failed to add item to wishlist' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const productId = request.nextUrl.searchParams.get('productId');

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid Product ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedItem = await Wishlist.findOneAndDelete({
      userId,
      productId: new mongoose.Types.ObjectId(productId)
    });

    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist' },
      { status: 500 }
    );
  }
}