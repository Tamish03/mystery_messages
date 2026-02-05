import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURI(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyToken === code
    const isCodeNotExpired = new Date(user.verifyTokenExpiry) > new Date()

    if (isCodeNotExpired && isCodeValid){
        user.isverified = true;
        await user.save()
        return Response.json(
            {
              success: true,
              message: "Account verified successfully",
            },
            { status: 200 }
          );
    }

    if(!isCodeNotExpired){
        return Response.json(
            {
              success: false,
              message: "Verification code expired, please sign-up again to get a new code",
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