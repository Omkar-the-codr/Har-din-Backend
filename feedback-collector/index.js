const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const authRoutes = require('./routes/auth.js');
const verifyUser = require('./middleware/auth.js');
const feedbackRoutes = require('./routes/feedback.js');

app.use(helmet());
app.use(express.json());
app.use(cookieParser());


app.use(cors());

const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: "Too many requests, please try again later.",
});

app.use(limiter);

app.get("/api/secure", verifyUser, (req, res) =>{
    res.json({
        message: "This is a secure route, you are authenticated.",
        user: req.user
    });
})
app.use("/api/feedback", feedbackRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res)=>{
    res.send("Feedback Collector Backend is runnig");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log("Server is running on port" + PORT);
});