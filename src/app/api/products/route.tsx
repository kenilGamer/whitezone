import { NextResponse } from "next/server";
import Product from "@/model/Products";
import dbConnect from "@/lib/db-connect";

// Cache duration in seconds
const CACHE_DURATION = 60;

// Handle GET requests to fetch all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || '-createdAt';

    await dbConnect();

    // Build query
    const query: Record<string, string> = {};
    if (category) {
      query.category = category;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    // Create response with cache headers
    const response = NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });

    response.headers.set('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`);
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Handle POST requests (Create a new product)
export async function POST(request: Request) {
  try {
    await dbConnect(); // Ensure the database is connected

    const body = await request.json(); // Parse the request body
    const { name, price, category, image } = body;

    // Validate the required fields
    if (!name || !price || !category || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create a new product
    const newProduct = new Product({ name, price, category, image });
    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Convert string values to appropriate types
    if (body.price) {
      body.price = parseFloat(body.price);
    }
    if (body.stock) {
      body.stock = parseInt(body.stock);
    }
    if (body.discount) {
      body.discount = parseFloat(body.discount);
    }
    if (body.weight) {
      body.weight = parseFloat(body.weight);
    }

    // Use findOneAndUpdate for better atomicity
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Create response with no-cache headers
    const response = NextResponse.json(updatedProduct, { status: 200 });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect(); // Ensure the database is connected

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Get the product ID from the query string

    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}