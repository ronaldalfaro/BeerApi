const express = require('express');
const User = require('../models/userModel');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

//Registration route
router.post('/register', async (req, res) =>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    //validate if email exist
    const emailExist = await User.findOne({email:user.email});
    if(emailExist) return res.status(400).send({message:'El correo electrónico ya existe'});

    try {//if all is ok save new user
        const savedUser = await user.save();
        res.json({user:savedUser._id});
    } catch (error) {
        res.status(400).send(error);
    }
});

//Login route
router.post('/login', async (req, res) =>{

    //validate email and password is there
    if(req.body.email === "" || req.body.password === "") return res.status(400).send({message:'Debes ingresar correo electrónico y contraseña'});

    //validate email fortmat
    if(!validator.isEmail(req.body.email)) return res.status(400).send({message:'Ingresa un correo electrónico válido'});

        const userExist = await User.findOne({email:req.body.email}).select('+password');
        
        //validate password is correct
        if(!userExist || !(await userExist.correctPassword(req.body.password, userExist.password))){
            return res.status(400).send({message:'Correo electrónico o contraseña no válido'});
        }else{
            //create and assign a token
            const token = jwt.sign({_id: userExist._id}, process.env.TOKEN_SECRET);
            res.header('auth-token',token).send({token:token});
        }
});

module.exports = router;