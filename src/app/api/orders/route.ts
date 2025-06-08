import { NextResponse } from "next/server";
import Order from "@/model/Orders";
import dbConnect from "@/lib/db-connect";

// Handle GET requests to fetch orders for a user
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

    const orders = await Order.find({ userId }).sort({ date: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Handle POST requests to create a new order
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, items, total, paymentMethod } = body;

    // Validate required fields
    if (!userId || !items || !total || !paymentMethod) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create new order
    const newOrder = new Order({
      userId,
      items,
      total,
      paymentMethod,
      status: 'pending',
      date: new Date(),
    });

    await newOrder.save();
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
} 