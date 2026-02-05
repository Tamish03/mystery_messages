 import mongoose ,{ Document, Schema } from 'mongoose';

    export interface Message extends Document {
        content:string;// in typescript we use string instead of String
        createdAt: Date;

    }    
    const messageSchema: Schema<Message> = new Schema({
        content:{
            type:String,
            required:true,

        },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now,
        }

    })

     export interface User extends Document {
       username: string;
       email:string;
       password:string;
       verifyToken:string;
       verifyTokenExpiry:Date;
       isVerified?:boolean;
       isAcceptingMessages:boolean;
       messages:Message[];
     }

        const userSchema: Schema<User> = new Schema({
        username:{
            type:String,
            required:[true,"username is required"],
            trim:true,
            unique:true,
        },
        email:{
            type:String,
           required:[true,"Email is required"],
           unique:true,
           match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please fill a valid email address"],
        },
        password:{
            type:String,
           required:[true,"password is required"],
        },
        verifyToken:{
            type:String,
            required:[true,"verifyToken is required"],
        },
        verifyTokenExpiry:{
            type:Date,
            required:[true,"verifyTokenExpiry is required"],
        },
        isVerified:{
            type:Boolean,
            default:false,
        },
        isAcceptingMessages:{
            type:Boolean,
            default:true
        },
        messages:[messageSchema]
    })

    const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);
    export default userModel;

    // mongoose.models=m collection of all models created so far
    // mongoose.model<User>('User',userSchema) creates a new model called User based on userSchema
    // Typescript sees mongoose.models.User as mongoose.Model<User> and checks if it exists
    // if it exists we use it otherwise we create a new model