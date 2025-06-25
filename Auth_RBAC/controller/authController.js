const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../config/db.js');

const JWT_SECRET = "Secret";


const signup = async (req, res)=>{
    const {name, email, age, password, role="user"} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(role);
        const [result] = await pool.query(
            "Insert into users (name, email, age, password, role) values (?, ?, ?, ?,?)", [name, email, age, hashedPassword, role]
        );

        const token = jwt.sign({id: result.insertId, email, role}, JWT_SECRET, {expiresIn: '1h'});

        res.status(201).json({token});
    } catch(err){
        res.status(500).json({error: err.message});
    }
};




const login = async(req, res) =>{
    const {email, password} = req.body;

    try{
        const [users] = await pool.query("Select * from users where email = ?",[email]);
        if(users.length == 0){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const user = users[0];
        // console.log(user);
        // console.log("password is", password);
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }
        
        const token = jwt.sign({id: user.id, email, role: user.role}, JWT_SECRET, {expiresIn: "1h"});

        res.json({token});
    } catch(err){
        res.status(500).json({error: err.message});
    }
};



module.exports = {
    signup,
    login
}