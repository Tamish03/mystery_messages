import {getToken} from  "next-auth/jwt";
import {NextResponse,NextRequest} from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(req:NextRequest){
    const token = await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    const url = req.nextUrl;

    const authPaths= ["/sign-in","/signup","/verify","/"];
    //“Now that middleware is running, how should I treat this route?”

    if(authPaths.includes(url.pathname) && !token){
        return NextResponse.redirect(new URL("/sign-in",url));
    }

if(token && (url.pathname === "/sign-in" || url.pathname === "/signup" || url.pathname === "/")){
    return NextResponse.redirect(new URL("/dashboard",url));
}
return NextResponse.next();
}

//It tells Next.js which routes should run this middleware.
export const config = {
    matcher:[
        "/","/sign-in","/signup",
        "/dashboard/:path*",
        "/verify/:path*"
    ]
};
