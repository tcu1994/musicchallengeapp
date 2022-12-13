var mongoose = require('mongoose');
  
var userSchema = new mongoose.Schema({
    name : String,
    username : String,
    email : String,
    password : String,
    entries : [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Entry'
        }
    ],
    challenges: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Challenge'
        }
    ],
    voted : [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Entry'
        }
    ],
    link : String,
    unreadMessages : Number,
    unreadInboxes : [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Inbox'
        }
    ],
    role : String,
});
  
  
module.exports = new mongoose.model('User', userSchema);