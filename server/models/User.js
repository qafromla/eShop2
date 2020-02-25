const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10; 
const jwt = require('jsonwebtoken');

require('dotenv').config();


const userSchema = mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },

    password: {
        type: String,
        required: true,
        minlength: 5,
        
    },

    name: {
        type: String,
        required: true,
        maxlength: 100
    },

    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },

    cart: {
        type: Array,
        default: [],

    },
    history: {
        type: Array,
        default: [],

    },

    role: {
        type: Number,
        default: 0
    },

    token: {
        type: String
    }


}) ;

//before saving we wanna hashing pass
userSchema.pre('save', function ( next )  {
        let user = this;

    //.isModified() is method from Mongo

       if( user.isModified('password')  ) {
           bcrypt.genSalt(SALT_I, (err, salt) => {

               if (err) return next(err);

               bcrypt.hash(user.password, salt, function (err, hash) {
                   if (err) return next(err);
                   user.password = hash;
                   next();

               });
           })
       }  else {
           next();
       }
})

userSchema.methods.comparePassword = function ( candidatePass, cbFunc)  {
    bcrypt.compare(candidatePass, this.password, function(err, isMatch){
        if(err) return cbFunc(err);
        cbFunc(null, isMatch);
    })
}

userSchema.methods.generateToken = function ( cbFunc )  {
    let user = this;

    let token = jwt.sign(user._id.toHexString(), process.env.SECRET);

    user.token = token; 
    user.save( function (err, user) {
         if(err) return cbFunc(err);
         cbFunc(null, user);
    })

}

const User = mongoose.model('User', userSchema); 
module.exports = {User};