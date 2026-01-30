import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User{
     _id?: string;   
     isverifed?:boolean;
     isAcceptingMessages?:boolean;
     username?:string;
    }
    interface Session extends DefaultSession {
         user: User;
    }
}
declare module 'next-auth/jwt' {
    interface JWT {
     _id?: string;
        isverified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }}