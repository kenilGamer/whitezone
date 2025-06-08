import { NextResponse } from "next/server";
import Order from "@/model/Orders";
import dbConnect from "@/lib/db-connect";
import { z } from 'zod';

// Validation schema for order creation
const orderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })).min(1, "At least one item is required"),
  total: z.number().min(0, "Total must be a positive number"),
  paymentMethod: z.enum(['credit_card', 'paypal', 'cash'], {
    errorMap: () => ({ message: "Invalid payment method" })
  })
});

// Handle GET requests to fetch orders for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Build query
    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
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

    // Validate request body
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { userId, items, total, paymentMethod } = validationResult.data;

    // Create new order with additional metadata
    const newOrder = new Order({
      userId,
      items,
      total,
      paymentMethod,
      status: 'pending',
      date: new Date(),
      lastUpdated: new Date(),
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    });

    await newOrder.save();

    // Create response with no-cache headers
    const response = NextResponse.json(newOrder, { status: 201 });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
} 