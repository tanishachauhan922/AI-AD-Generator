const mongoose= require("mongoose");
const connectDB =async () =>{
    try {
        if (!process.env.URI) {
            throw new Error("MongoDB connection URI (URI) is not configured");
        }
        await mongoose.connect(process.env.URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
    
}
module.exports =connectDB;