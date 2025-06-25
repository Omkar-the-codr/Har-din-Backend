const express = require('express');
const { postUser, getAllUsers, getUser, putUser, deleteUser } = require('../controller/userController');


const {validateUser} = require("../middleware/validateUser.js")
const router = express.Router();

const {authenticate} = require('../middleware/authMiddleware.js');

const {authorizeRole} = require("../middleware/authorizeRole.js"); 

router.post('/users', validateUser, postUser);
router.get('/users', authenticate ,authorizeRole('admin'), getAllUsers );
router.get('/users/:id', getUser);
router.put('/users/:id',validateUser, putUser);
router.delete('/users/:id',authenticate, authorizeRole('admin'), deleteUser);


module.exports = {router};