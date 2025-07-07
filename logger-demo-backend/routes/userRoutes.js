const express = require('express');
const router = express.Router();
const logger = require('../logger/index.js');

let users = [];


router.post('/', (req, res)=>{
    const {name} = req.body;
    users.push({id: users.length+1, name});
    logger.info(`New user added: ${name}`);
    res.status(201).json({message: 'User created'});
});

router.get('/', (req, res)=>{
    logger.info(`Users fetched: Count = ${users.length}`);
    res.json(users);
})

router.get('/error', (req, res)=>{
    throw new Error('This is a manual error for testing');
})

module.exports = router;