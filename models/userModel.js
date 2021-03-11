const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//User Schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Por favor ingresa un nombre']
    },
    email:{
        type: String,
        required: [true, 'Por favor ingresa un correo electrónico'],
        unique:true,
        lowercase:true,
        validate: [validator.isEmail, 'Por favor igresa un correo electrónico válido']
    },
    password:{
        type:String,
        required:[true,'Por favor ingresa una contraseña'],
        minLenght: 4,
        select:false
    },
    date:{
        type: Date,
        default: Date.now
    }
});

// encrypt the password with bcryptjs
// Mongoose -> Middleware
userSchema.pre('save', async function(next){
    //check if password is modified
    if(!this.isModified('password')){
        return next();
    }
    //encrypt the password
    this.password = await bcrypt.hash(this.password,12);

    next();
});

userSchema.methods.correctPassword = async function(typedPassword, originalPassword){
    return await bcrypt.compare(typedPassword, originalPassword);
};

module.exports = mongoose.model('User', userSchema);