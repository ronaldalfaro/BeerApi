const mongoose = require('mongoose');

//Beer Schema
const beerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Por favor ingresa un nombre']
    },
    alcohol:{
        type: Number,
        required: [true, 'Por favor ingresa un porcentage de alcohol'],
    },
    type:{
        type:String,
        required:[true,'Por favor ingresa un tipo de cerveza'],
        enum: ['Ale','Lager','Pale ale','Pilsner'],
        default:'Ale'
    },
    date:{
        type: Date,
        default: Date.now
    }
});

//Exporting Beer model
module.exports = mongoose.model('Beer', beerSchema);