const express = require("express");
const pool = require('./config/db.js')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;
const {router} = require('./router/userRouter.js')
const authRouter = require('./router/authRouter.js')
app.use(express.json());
app.use('/', authRouter);
app.use('/api', router);
app.get("/test", async (req, res)=>{
    try{
        const [rows] = await pool.query("Select 2+1 As result");
        res.json({dbCheck: rows[0].result});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

app.listen(PORT, ()=>{
    console.log("Server is running on port ", PORT);
})