const mongoose= require("mongoose");
const connectDB =async () =>{
    try {
        await mongoose.connect(process.env.URI);
    console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("error detected",error.message);
    }
    
}
module.exports =connectDB;