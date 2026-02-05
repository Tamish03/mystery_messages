import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { User } from "next-auth";
import type { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, context: { params: Promise<{ messageid: string }> }) {
    void request;
    const { messageid } = await context.params;
    const messageId = messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updateResult.modifiedCount === 0) {
            return Response.json({ success: false, message: "Message not found or already deleted" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Message Deleted" }, { status: 200 });
    } catch {
        return Response.json({ success: false, message: "Error deleting message" }, { status: 500 });
    }
}
