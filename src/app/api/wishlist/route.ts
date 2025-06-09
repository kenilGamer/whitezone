import { NextResponse } from 'next/server';
import Wishlist from '@/model/Wishlist';
import dbConnect from '@/lib/db-connect';

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
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, name, price, image, category } = body;

    if (!userId || !productId || !name || !price || !image || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const wishlistItem = new Wishlist({
      userId,
      productId,
      name,
      price: Number(price),
      image,
      category
    });

    await wishlistItem.save();

    return NextResponse.json(wishlistItem);
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Item is already in wishlist' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    );
  }
} 