import { NextResponse } from "next/server";
import Product from "@/model/Products";
import dbConnect  from "@/lib/db-connect";

// Handle GET requests to fetch all products
export async function GET() {
  try {
    await dbConnect(); // Connect to the database
    const products = await Product.find(); // Fetch all products
    return NextResponse.json(products, { status: 200 });
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

// Handle PUT requests (Update a product)
export async function PUT(request: Request) {
  try {
    await dbConnect(); // Ensure the database is connected

    const body = await request.json(); // Parse the request body
    const { _id, name, price, category, image } = body;

    // Validate the required fields
    if (!_id || !name || !price || !category || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      _id, // Use `_id` to find the product
      { name, price, category, image },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct, { status: 200 });
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