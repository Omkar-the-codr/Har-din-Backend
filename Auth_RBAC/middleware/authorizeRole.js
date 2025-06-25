const authorizeRole = (requiredRole) =>{
    return (req, res, next)=>{
        if(!req.user || req.user.role !== requiredRole){
            return res.status(401).json({message: "Access denied: insufficient priviliges"});
        }
        next();
    }
}


module.exports = {authorizeRole};