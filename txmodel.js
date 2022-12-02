const mongoose = require('mongoose')

const txSchema = new mongoose.Schema({
    
    to: {type: String},
    from: {type: String},
    sum: {type: Number}
},
{timestamps: true});

module.exports = mongoose.model('Tx', txSchema);