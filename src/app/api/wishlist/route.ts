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
    const { userId, productId, name, price, image, category } = body;

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

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      userId,
      productId: new mongoose.Types.ObjectId(productId)
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item is already in wishlist' },
        { status: 400 }
      );
    }

    const wishlistItem = await Wishlist.create({
      userId,
      productId: new mongoose.Types.ObjectId(productId),
      name,
      price: typeof price === 'string' ? Number(price) : price,
      image,
      category
    });

    return NextResponse.json(wishlistItem);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
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