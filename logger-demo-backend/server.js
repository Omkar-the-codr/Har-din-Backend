const app = require('./app.js');
const logger = require('./logger/index.js');
const PORT = 3000;

app.listen(PORT, ()=>{
    logger.info(`Server started on http://localhost:${PORT}`)
});