const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
dotenv.config();
const taskRoutes = require("./routes/taskRoutes.js");

const app = express();

connectDB();
app.use(cors());
app.use(express.json());


app.get("/", (req, res)=>{
    res.send("Welcome to the API");
});
app.use('/api', taskRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
}
);