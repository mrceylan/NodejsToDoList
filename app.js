const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const logger = require('./helpers/loghelper');
dotenv.config();
const app = express();

//Middlewares
app.use(express.json());

//Routes
const authRoute = require('./routes/auth');
app.use('/api/user', authRoute);
const todoRoute = require('./routes/todo');
app.use('/api/todo', todoRoute);



//mongo connection
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }
    , () => {
        logger.info('Connected to MongoDb..');
    }).catch(err=>{
        console.log(err);
    });

app.listen(process.env.LISTEN_PORT, ()=>{
    logger.info('Server started on port ' + process.env.LISTEN_PORT);
})