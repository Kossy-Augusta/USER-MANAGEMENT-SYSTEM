import mongoose from "mongoose";

export const connectDB = async(): Promise<void>=>{
    try{
        if (!process.env.DATABASE_URI){
            throw new Error("DATABASE_URI environment variable is not set");
        }
        await mongoose.connect(process.env.DATABASE_URI);
    } catch(err){
        console.log(err);
        process.exit(1)
    }
}