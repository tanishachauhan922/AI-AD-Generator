const express=require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app=express();
dotenv.config();
//adding routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

const templateRoute = require("./routes/templateRoute");
const generateAdRoutes = require("./routes/generateADRoute");
const criticRoute = require("./routes/criticRoute");
app.use(express.json());
app.use(cors());



const connectDB = require("./config/db");
const uploadToCloud = require("./routes/uploadToCloud");



app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadToCloud);


app.use("/api/templates", templateRoute);
app.use("/api/generate-ad", generateAdRoutes);
app.use("/api/critic", criticRoute);

app.get("/",(req,res)=>{
    res.send("working");
})

const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exitCode = 1;
    }
};

startServer();
