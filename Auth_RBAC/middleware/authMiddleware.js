const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Secret';

const authenticate = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Missing token"});
    }

    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch(err){
        res.status(403).json({message: "Invalid or expired token"});
    }
}

module.exports = {authenticate};