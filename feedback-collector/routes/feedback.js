const express = require('express');
const router = express.Router();
const pool = require('../utils/db.js');
const verifyUser = require('../middleware/auth.js');


router.post('/feedback', verifyUser, async(req, res)=>{
    const {message} = req.body;
    const user_id = req.user.id;
    try{
        await pool.query(
            "Insert into feedback (user_id, message) values (?, ?)", [user_id, message]
        );
        res.status(201).json({
            message: "Feedback submitted successfully"
        });
    } catch(err){
        res.status(500).json({
            error: "Failed to submit feedback",
            detail: err.message
        });
    }
})

module.exports = router;