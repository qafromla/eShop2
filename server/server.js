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
// MIDDLEWARES
//==============
const auth = require('./middleware/auth');

//==============
// MODELS
//==============

const { User } = require('./models/User');




//==============
// USERS
//==============

app.get('/api/users/auth', auth,  (req, res ) => {
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history
    })
})




app.post('/api/users/register', (req, res) => {
    
    const user = new User( req.body );

    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true, userdata: doc.name })
    });

});


app.post('/api/users/login', (req, res) => {

    //STEPS:
    //find email
    //check pass
    //generate token


    User.findOne({'email': req.body.email }, (err, user) => {
        if(!user) return res.json({loginSuccess: false, message: 'Auth failes, email not found'});

        user.comparePassword( req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({loginSuccess: false, message: 'wrong password'});

            user.generateToken((err, user)=> {
                if(err) return res.status(400).send(err);
                res.cookie('w_auth', user.token ).status(200).json({loginSuccess: true})
            } )
        } ) 

    })

   

})












const port = process.env.PORT || 3002;

app.listen(port, ()=> console.log(`Sever running on port: ${port}`));