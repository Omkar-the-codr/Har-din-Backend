const express = require('express');
const app = express();
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
const noteroutes = require('./routes/noteRoutes.js');

dotenv.config();

connectDB();


app.use(express.json());
app.use('/api/notes', noteroutes);

app.get('/', (req, res) => {
    res.send("Hello World! What is up? The API is working fine.");
})


app.listen(PORT, ()=>{
    console.log("Server is running on port 3000");
})