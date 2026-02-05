import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { z } from "zod";

const verifyRequestSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  verifyToken: z.string().optional(),
  code: z.string().optional(),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const parsed = verifyRequestSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      return Response.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { username, email, verifyToken, code } = parsed.data;
    const rawToken = (verifyToken ?? code ?? "").toString().trim();
    if (!rawToken || rawToken.length !== 6) {
      return Response.json(
        { success: false, message: "Invalid verification token" },
        { status: 400 }
      );
    }

    const decodedUsername = username ? decodeURIComponent(username) : "";
    if (!decodedUsername && !email) {
      return Response.json(
        { success: false, message: "Username or email is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne(
      decodedUsername ? { username: decodedUsername } : { email }
    );

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        {
          success: true,
          message: "Account already verified",
        },
        { status: 200 }
      );
    }

    if (!user.verifyToken || !user.verifyTokenExpiry) {
      return Response.json(
        {
          success: false,
          message: "Verification code missing. Please sign-up again.",
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyToken === rawToken;
    const isCodeNotExpired = new Date(user.verifyTokenExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      user.isVerified = true;
      user.verifyToken = "";
      user.verifyTokenExpiry = new Date(0);
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    }

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired, please sign-up again to get a new code",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Incorrect verification code",
      },
      { status: 400 }
    );
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
