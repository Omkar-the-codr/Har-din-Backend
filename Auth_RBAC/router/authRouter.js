const express = require('express');

const {signup, login} = require('../controller/authController');
const { validateUser } = require('../middleware/validateUser');

const router = express.Router();

router.post("/signup", validateUser, signup);
router.post('/login', login);


module.exports = router;