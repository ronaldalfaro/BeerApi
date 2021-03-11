const mongoose = require('mongoose');
const validator = require('validator');

//Consumption Schema
const consumptionSchema = new mongoose.Schema({
    beer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beer"
     },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
    count:{
        type: Number,
        required: [true, 'Por favor ingresa una cantidad'],
        min: [1, "La cantidad mínima de consumo es 1"],
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Consumption', consumptionSchema);