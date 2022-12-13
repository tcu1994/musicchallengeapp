var mongoose = require('mongoose');
  
var entrySchema = new mongoose.Schema({
    songURL : String,
    votes : Number,
    challenge : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Challenge'
    },
    user : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    voted : [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    plays : Number,
    winner : Boolean,
    authorsChoice : Boolean


},{ timestamps: true });
  
  
module.exports = new mongoose.model('Entry', entrySchema);