const express = require('express');
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
    windowMs: 10*1000,
    max: 3,
    handler: (req, res, next)=>{
        res.status(429).send(`
            <h1>Too many Requests</h1>
            <p>Please try again after 10 seconds</p>`
        );
    }
});

app.use(limiter);

app.get('/', (req, res)=>{
    res.json("You are within the limit!");
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})