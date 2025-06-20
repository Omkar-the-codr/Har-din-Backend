const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors  = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter.js")



dotenv.config();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log(err);
})

app.use("/api/auth", authRouter); 
app.get('/', (req, res)=>{
    res.json({message: "Hello, World!"});
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})