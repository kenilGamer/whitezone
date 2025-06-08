import { NextResponse } from "next/server";
import UserModel from "@/model/user";
import dbConnect from "@/lib/db-connect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// Handle PUT requests to update user profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session user:", session?.user); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - No session email" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const { username, image } = body;
    console.log("Request body:", { username, image }); // Debug log

    // Validate required fields
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // First find the user to ensure they exist
    const userByEmail = await UserModel.findOne({ email: session.user.email });
    console.log("Found user by email:", userByEmail ? "Found" : "Not found"); // Debug log

    let user = userByEmail;
    if (!user) {
      // Try to find user by username as fallback
      const userByUsername = await UserModel.findOne({ username: session.user.username });
      console.log("User by username:", userByUsername ? "Found" : "Not found"); // Debug log

      if (!userByUsername) {
        // If user not found, create a new user with the session data
        console.log("Creating new user with session data:", {
          email: session.user.email,
          username: session.user.username,
          role: session.user.role
        });

        user = new UserModel({
          email: session.user.email,
          username: session.user.username,
          role: session.user.role || 'user',
        });

        await user.save();
        console.log("Created new user:", user);
      } else {
        user = userByUsername;
      }
    }

    // Check if username is already taken by another user
    const existingUser = await UserModel.findOne({
      username,
      email: { $ne: session.user.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Update user profile
    user.username = username;
    if (image) {
      user.image = image;
    }
    await user.save();
    console.log("Updated user:", user); // Debug log

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
} 