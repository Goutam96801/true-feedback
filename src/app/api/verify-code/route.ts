import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    // Find user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if code matches and is not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: 'Account verified successfully!' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: 'Verification code has expired. Please sign up again.',
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    return Response.json(
      { success: false, message: 'Error verifying code' },
      { status: 500 }
    );
  }
}