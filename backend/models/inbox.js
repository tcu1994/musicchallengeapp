var mongoose = require('mongoose');
  
var inboxSchema = new mongoose.Schema({

    user1 : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    user2 : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    messages : [
        {
            message : String,
            time : Date,
            user : {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            }
        }
    ],
    lastMessage : Date,
    isRead : Boolean

})

module.exports = new mongoose.model('Inbox', inboxSchema);