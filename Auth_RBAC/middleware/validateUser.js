const {body, validationResult} = require('express-validator');

const validateUser = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invvalid emmail"),
    body("age").isInt({min:0}).withMessage("Age must be a positive Integer"),
    body("role").optional().isIn(['admin', 'user']).withMessage("Invalid role"),
(req, res, next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error: errors.array()});
    }
    next();
}];

module.exports = {validateUser};