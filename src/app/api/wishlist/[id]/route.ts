import { NextResponse } from 'next/server';
import Wishlist from '@/model/Wishlist';
import dbConnect from '@/lib/db-connect';

// DELETE /api/wishlist/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedItem = await Wishlist.findOneAndDelete({
      _id: id,
      userId
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
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist' },
      { status: 500 }
    );
  }
} 