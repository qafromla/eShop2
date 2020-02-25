const express = require  ('express');
const bodyParser =  require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());



//==============
// MODELS
//==============

const { User } = require('./models/User');




//==============
// USERS
//==============

app.post('/api/users/register', (req, res) => {
    res.status(200);
})












const port = process.env.PORT || 3002;

app.listen(port, ()=> console.log(`Sever running on port: ${port}`));