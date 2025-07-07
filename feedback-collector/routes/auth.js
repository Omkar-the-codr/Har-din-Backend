const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../utils/db.js");
const dotenv = require('dotenv');
dotenv.config();

router.post('/signup', async (req, res)=>{
    const {name, email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]
        );
        res.status(201).json({
            message: "User created successfully",
            result: {
                id: result.insertId,
                name: name,
                email: email
                }
        })
    } catch(err){
        res.status(500).json({
            error: "Signup failed", detail: err.message
        })
    }
});


router.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    try{
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        if(!user){
            return res.status(401).json({
                error: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                error: "Invalid password"
            });
        }
        // Generate JWT token (optional)
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 2*24*60*60*1000,
        });
        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch(err){
        res.status(500).json({
            error: "Login failed", detail: err.message
        });
    }
});


router.post('/logout', (req, res)=>{
    res.clearCookie("token");
    res.json({
        message: "Logout successful"
    })
})

module.exports = router;