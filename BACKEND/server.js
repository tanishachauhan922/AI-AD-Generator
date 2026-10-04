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
connectDB();



app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadToCloud);


app.use("/api/templates", templateRoute);
app.use("/api/generate-ad", generateAdRoutes);
app.use("/api/critic", criticRoute);

app.get("/",(req,res)=>{
    res.send("working");
})


