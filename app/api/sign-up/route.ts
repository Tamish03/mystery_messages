import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/userModel";
import bcrypt from "bcrypt";
import { signUpSchema } from "@/schemas/signUpSchema";
import { randomInt } from "crypto";


// algorithm
/*
  if existinguserByEmail exists then
    if existingUserByEmail.isVerified then
      success false;
    else
      save updated user
    end if
  else
    create new user with the provided credentials
    save new user
  end if

  */

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      return Response.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    const existingUserVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const verifyToken = randomInt(100000, 1000000).toString();
    const verifyTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already registered and verified",
          },
          { status: 400 }
        );
      }
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyToken = verifyToken;
      existingUserByEmail.verifyTokenExpiry = verifyTokenExpiry;
      existingUserByEmail.isVerified = false;
      await existingUserByEmail.save();
    } else {
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiry,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyToken
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Verification email sent.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error registering user", err);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}  

