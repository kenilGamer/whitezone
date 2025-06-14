import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/db-connect';
import User from '@/model/user';
import type { Document } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { message: 'Verification code is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user from database
    const user = await User.findOne({ email: token.email }) as (Document & {
      email: string;
      isVerified: boolean;
      verifiedAt?: Date;
      save(): Promise<void>;
    }) | null;

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // For admin users, auto-verify
    if (token.role === 'admin') {
      // Update user verification status
      user.isVerified = true;
      user.verifiedAt = new Date();
      await user.save();

      return NextResponse.json(
        { 
          message: 'Verification successful',
          user: {
            email: token.email,
            name: token.name,
            role: token.role,
            isVerified: true
          }
        },
        { status: 200 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        { message: 'User is already verified' },
        { status: 400 }
      );
    }

    // Verify the code
    const isValid = await verifyCode(code, user);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    return NextResponse.json(
      { 
        message: 'Verification successful',
        user: {
          email: token.email,
          name: token.name,
          role: token.role,
          isVerified: true
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function verifyCode(code: string, user: Document & {
  email: string;
  isVerified: boolean;
  verifiedAt?: Date;
}): Promise<boolean> {
  try {
    // Check if verification code exists and hasn't expired
    const verificationCode = await User.findOne({
      email: user.email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() }
    });

    return !!verificationCode;
  } catch (error) {
    console.error('Error verifying code:', error);
    return false;
  }
} 