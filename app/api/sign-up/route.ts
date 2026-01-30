import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/userModel";
import bcrypt from "bcrypt";


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

export async function POST (req:Request,res:Response){
    await dbConnect();
    try{
        const {username, email, password} = await req.json();
        const existingUserVerifiedBhyUsername = await userModel.findOne({username, isverified:true});
        if(existingUserVerifiedBhyUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },
            {status:400} );
        }
        const existingUserByEmail = await userModel.findOne({email});
        const verifyToken = Math.floor(100000 + Math.random() * 900000).toString(); 
        const verifyTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

        const hashedPassword = await bcrypt.hash(password, 10);
        if(existingUserByEmail){
            if(existingUserByEmail.isverified){
                return Response.json({
                    success:false,
                    message:"Email is already registered and verified"
                },
                {status:400} );
            }
            existingUserByEmail.username = username;
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyToken = verifyToken;
            existingUserByEmail.verifyTokenExpiry = verifyTokenExpiry;
            await existingUserByEmail.save();
        }
        else{
            const newUser = new userModel({
                username,
                email,
                password:hashedPassword,
                verifyToken,
                verifyTokenExpiry,
                isAcceptingMessages:true,
                messages:[],
            });
            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(email, username, verifyToken);
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:"Failed to send verification email"
            },
            {status:500} );
        }
        return Response.json({
            success:true,
            message:"User registered successfully. Verification email sent."
        },
        {status:201} );
    }
    catch(err){
        console.error("Error registering user", err);
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },
        {status:500} );
    }
}  

