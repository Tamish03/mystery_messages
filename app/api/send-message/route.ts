import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { Message } from "@/model/userModel";
import { z } from "zod";

const sendMessageSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  content: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: "Message content cannot be empty" })
    .refine((val) => val.length <= 1000, { message: "Message content cannot exceed 1000 characters" }),
});

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid input";
    return Response.json({ success: false, message: firstError }, { status: 400 });
  }
  const decodedUsername = decodeURIComponent(parsed.data.username);
  const { content } = parsed.data;

  try {
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.isAcceptingMessages) {
      return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 });
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Send message failed:", error);
    const message =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "Internal server error";
    return Response.json({ success: false, message }, { status: 500 });
  }
}
