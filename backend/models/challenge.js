var mongoose = require('mongoose');
  
var challengeSchema = new mongoose.Schema({
    name : String,
    photoURL : String,
    text : String,
    entries : [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Entry'
        }
    ],
    numOfEntries : Number,
    user : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    comments : [
        {
            user : {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            comment : String,
            time : Date
        }
    ],
    hasImage : Boolean,
    hasText : Boolean,
    winner : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Entry'
    },
    authorsChoice : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Entry'
    },
    hasEnded : Boolean,
    colors : [String],
    colorNames: [String]

},{ timestamps: true });
  
  
module.exports = new mongoose.model('Challenge', challengeSchema);