const express = require('express');
const app = express();
const JWT_SECRET = "jwtsecret";
const jwt = require("jsonwebtoken");

app.use(express.json());

const users = [];
 app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username, password
 })
    console.log(users);
     res.send({
        message: "User signed up successfully"
     });
    });
 
 
 app.post('/signin', (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    
    const User = users.find(user => user.username === username && user.password === password);
    console.log(User);
    if(User){
        const token = jwt.sign({
            username: User.username},
            JWT_SECRET);
            User.token = token;
        res.status(200).send({
            message: "User signed in successfully",
            token: token
        })
    }
    else{
        res.status(401).send({
            message: "Invalid username or password"
        });
    }
 });

 app.get("/me", (req, res) => {
    const token = req.headers.authorization;
    const userDetails = jwt.verify(token, JWT_SECRET);

    const username = userDetails.username;
    const User = users.find(user => user.username === username);
    if(User){
        res.send({
            username: User.username
        })
    }
    else{
        res.status(401).send({
            message: "Unauthorized"
        });
    }
 })

 app.listen(3000, ()=>{
    console.log(`Server is running on port 3000`);
 })