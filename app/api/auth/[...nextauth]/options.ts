import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/userModel";


// User opens Login Page
//         ↓
// User enters Email + Password
//         ↓
// Frontend calls NextAuth signIn()
//         ↓
// NextAuth calls authorize()
//         ↓
// Your Code:
//   - Connect to DB
//   - Find user
//   - Compare password (bcrypt)
//         ↓
// return user
//         ↓
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
//    NextAuth takes over
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
//         ↓
// Create signed JWT
//         ↓
// Encrypt + store in HttpOnly cookie
//         ↓
// Attach expiry + CSRF protection
//         ↓
// Session created
//         ↓
// useSession() / getServerSession()
//         ↓
// User is authenticated everywhere


// User opens Login Page
//         ↓
// User submits Email + Password
//         ↓
// Frontend calls /api/login
//         ↓
// Your API:
//   - Connect to DB
//   - Find user
//   - Compare password
//         ↓
// Create JWT manually
//         ↓
// Sign JWT with secret
//         ↓
// Set cookie manually
//         ↓
// Choose cookie flags
//         ↓
// Implement CSRF protection
//         ↓
// Handle expiry & refresh
//         ↓
// Verify JWT on EVERY request
//         ↓
// Protect API routes manually
//         ↓
// Protect pages manually
//         ↓
// Implement logout
//         ↓
// Handle token expiration


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter your username" },
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials?.email },
                            { username: credentials?.username },
                        ],
                    });

                    if (!user) {
                        throw new Error("No user found with the given email or username");
                    }
                    if (!user.isVerified) {
                        throw new Error("User email is not verified");
                    }
                    const isPasswordValid = await bcrypt.compare(credentials?.password || "", user.password);
                    if (isPasswordValid) {
                        return user;
                    }
                    return null;
                } catch (error) {
                    console.error("Error during authorization:", error);
                    return null;
                }
            }
        })
    ],
    //     ┌──────────────────────────┐
    // │        USER ACTION       │
    // └──────────────────────────┘
    //             ↓
    // User submits login form
    //             ↓
    // ┌──────────────────────────┐
    // │      authorize()         │
    // │  (Credentials Provider) │
    // └──────────────────────────┘
    //             ↓
    // Are credentials valid?
    //      ┌──────┴──────┐
    //      │             │
    //     NO            YES
    //      │             ↓
    // Login fails ❌   return user
    //                    ↓
    //         ┌──────────────────────────┐
    //         │       jwt() callback     │
    //         └──────────────────────────┘
    //                    ↓
    //       (First time login only)
    //       user / account / profile exist
    //                    ↓
    //      Store custom data in token
    //      (userId, role, isVerified)
    //                    ↓
    //         Return updated token
    //                    ↓
    //       Token encrypted & stored
    //       in HttpOnly cookie 🍪
    //                    ↓
    //         ┌──────────────────────────┐
    //         │     session() callback   │
    //         └──────────────────────────┘
    //                    ↓
    //     Copy safe fields from token
    //           → session.user
    //                    ↓
    //          Session sent to client
    //                    ↓
    //            USER LOGGED IN ✅

    // Client calls useSession()
    //         ↓
    // NextAuth reads JWT from cookie
    //         ↓
    // ┌──────────────────────────┐
    // │       jwt() callback     │
    // └──────────────────────────┘
    //         ↓
    // (token only — no user now)
    //         ↓
    // Token expiry extended
    //         ↓
    // Return token
    //         ↓
    // ┌──────────────────────────┐
    // │     session() callback   │
    // └──────────────────────────┘
    //         ↓
    // session.user rebuilt
    // from token data
    //         ↓
    // Session returned to client


   callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified; 
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerifed = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        }

    },
    pages: {
       signIn: "/sign-in",

    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions;