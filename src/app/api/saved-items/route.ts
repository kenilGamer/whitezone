import { NextResponse } from "next/server";
import SavedItem from "@/model/SavedItems";
import dbConnect from "@/lib/db-connect";

// Handle GET requests to fetch saved items for a user
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const savedItems = await SavedItem.find({ userId }).sort({ date: -1 });
    return NextResponse.json(savedItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved items:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved items" },
      { status: 500 }
    );
  }
}

// Handle POST requests to save an item
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, productId, name, price, image } = body;

    // Validate required fields
    if (!userId || !productId || !name || !price || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if item is already saved
    const existingItem = await SavedItem.findOne({ userId, productId });
    if (existingItem) {
      return NextResponse.json(
        { error: "Item is already saved" },
        { status: 400 }
      );
    }

    // Create new saved item
    const newSavedItem = new SavedItem({
      userId,
      productId,
      name,
      price,
      image,
      date: new Date(),
    });

    await newSavedItem.save();
    return NextResponse.json(newSavedItem, { status: 201 });
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json(
      { error: "Failed to save item" },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to remove a saved item
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    const deletedItem = await SavedItem.findOneAndDelete({ userId, productId });
    if (!deletedItem) {
      return NextResponse.json(
        { error: "Saved item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item removed from saved items" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing saved item:", error);
    return NextResponse.json(
      { error: "Failed to remove saved item" },
      { status: 500 }
    );
  }
} 