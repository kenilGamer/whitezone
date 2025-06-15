import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db-connect';
import Wishlist from '@/model/Wishlist';

// GET /api/wishlist
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await dbConnect();
    const wishlist = await Wishlist.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist
export async function POST(request: Request) {
  try {
    const { userId, productId, name, price, image, category } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      );
    }

    const wishlistItem = await Wishlist.create({
      userId,
      productId,
      name,
      price,
      image,
      category,
    });

    return NextResponse.json({ wishlist: wishlistItem });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Log the query parameters for debugging
    console.log("Deleting wishlist item:", { userId, productId });

    const result = await Wishlist.findOneAndDelete({ userId, productId });

    // Log the result for debugging
    console.log("Delete result:", result);

    if (!result) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}