const jwt = require('jsonwebtoken');


const verifyUser = (req, res, next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            error: "Unauthorized access, please login first."
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch(err){
        return res.status(401).json({
            error: "Invalid token, please login again.",
            detail: err.message
        })
    }
}

module.exports = verifyUser;