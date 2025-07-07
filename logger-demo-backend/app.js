const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logger = require('./logger/index.js');

const app = express();
app.use(express.json());


const stream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream}));

const userRoutes = require('./routes/userRoutes.js');
app.use('/api/users', userRoutes);

app.get('/crash', ()=>{
    throw new Error('Forced Crash for Testing');
});

app.use((err, req, res, next)=>{
    logger.error(`${err.message}`, {stack: err.stack});
    res.status(500).json({error: 'Something broke!'})
})

module.exports = app;