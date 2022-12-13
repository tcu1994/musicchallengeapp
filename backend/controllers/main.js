const User = require('../models/user');
const Challenge = require('../models/challenge');
const Entry = require('../models/entry');
const Inbox = require('../models/inbox');
const { query } = require('express');
const challenge = require('../models/challenge');


exports.postChallenge = async (req, res) => {
    if (!req.body.photoURL && !req.body.text){
        return res.status(409).send({
            message : 'Either photo or text required!'
        });
    }else{
        let challenge = new Challenge({ 
            name : req.body.name,
            photoURL : req.body.photoURL,
            text : req.body.text,
            user : req.userId,
            numOfEntries : 0,
            colors : req.body.colors,
            colorNames : req.body.colorNames,
            hasEnded : false
        })
        if (req.body.photoURL){
            challenge.hasImage = true
        }
        if (req.body.text){
            challenge.hasText = true
        }
        await challenge.save();
        let user = await User.findById(req.userId);
        user.challenges.push(challenge);
        await user.save()
        return res.status(201).send({
            message : 'Challenge created!'
        });
    }
    
}
exports.search = async (req, res) => {
    let perPage = Math.floor((req.query.windowWidth) / 216) * 2
    let challenges = await Challenge.find()
    .skip(req.query.page * perPage).limit(perPage)
    return res.status(201).send({
        message : 'OK',
        challenges : challenges,
        pages : Math.floor(challenges.length / perPage) + 1
    });

}
exports.getChallenges = async (req, res) => {
    let sort = '-createdAt';
    let query = {
    }
    if (req.query.filter == 'Image'){
        query.hasImage = { '$eq' : true}
    }
    if (req.query.filter == 'Text'){
        query.hasText = { '$eq' : true}
    }
    if (req.query.sort == '2'){
        sort = 'createdAt'
    }
    if (req.query.sort == '3'){
        sort = '-numOfEntries'
    }
    if (req.query.sort == '4'){
        sort = 'numOfEntries'
    }
    if (req.query.searchQuery){
        ///query['$or'] = ( [ { name : { "$regex": req.query.searchQuery, "$options": "i" } }, { text : { "$regex": req.query.searchQuery, "$options": "i" } }, { colors : req.query.searchQuery}])
        query['$or'] =  [
            {name :  { "$regex": req.query.searchQuery, "$options": "i" }},
            {text :  { "$regex": req.query.searchQuery, "$options": "i" }},
            { colorNames : req.query.searchQuery}

        ]
    }
    // console.log(req.query)
    let perPage;
    if (req.query.isMobile){
        perPage = Math.floor((req.query.windowWidth) / 140) * 6
    }else{
        perPage = Math.floor((req.query.windowWidth) / 216) * 2
    }
    
    // console.log(req.query.windowWidth, perPage)
    
    let challenges = await Challenge.find(query).sort(sort).skip(req.query.page * perPage).limit(perPage)
    
    let challengeColors = await Challenge.find().select('colorNames');
    let colors = [];
    let colorQs = []
    for (let i = 0; i < challengeColors.length; i++){
        if (challengeColors[i].colorNames.length > 0 && challengeColors[i].colorNames[0] != null){
            if (colors.includes(challengeColors[i].colorNames[0])){
                colorQs[colors.indexOf(challengeColors[i].colorNames[0])] +=1 
    
            }else{
                colors.push(challengeColors[i].colorNames[0])
                colorQs.push(1)
            }
            if (colors.includes(challengeColors[i].colorNames[1])){
                colorQs[colors.indexOf(challengeColors[i].colorNames[1])] +=1 
    
            }else{
                colors.push(challengeColors[i].colorNames[1])
                colorQs.push(1)
            }
            if (colors.includes(challengeColors[i].colorNames[2])){
                colorQs[colors.indexOf(challengeColors[i].colorNames[2])] +=1 
    
            }else{
                colors.push(challengeColors[i].colorNames[2])
                colorQs.push(1)
            }
        }
        
    }





    return res.status(201).send({
        message : 'OK',
        challenges : challenges,
        pages : Math.floor(challenges.length / perPage) + 1,
        colors : colors,
        colorQs : colorQs
    });
}

exports.getChallenge = async (req, res) => {
    let challenge = await Challenge.findById(req.query.id).populate({
        path : 'entries',
        populate : {
            path : 'user',
            model : 'User'
        }
    }).populate({
        path : 'user',
        model : 'User'
    }).populate({
        path : 'comments',
        populate :{
            path : 'user',
            model : 'User'
        }
            
        
    })
    return res.status(201).send({
        message : 'OK',
        challenge : challenge
    });
}

exports.postEntry = async (req, res) => {
    let entry = new Entry({ 
        name : req.body.name,
        songURL : req.body.songURL,
        user : req.userId,
        challenge: req.body.challenge,
        votes : 0,
        plays : 0
    })
    await entry.save();
    let challenge = await Challenge.findById(req.body.challenge)
    challenge.entries.push(entry);
    challenge.numOfEntries = challenge.numOfEntries + 1;
    await challenge.save()
    let user = await User.findById(req.userId);
    user.entries.push(entry);
    await user.save()


    return res.status(201).send({
        message : 'entry created!'
    });
}


exports.vote = async (req, res) => {
    let user = await User.findById(req.userId);
    let entry = await Entry.findById(req.body.id);
    if (!entry.voted.includes(req.userId)){
        
        entry.votes = entry.votes + 1;
        entry.voted.push(user._id)
        await entry.save();
        return res.status(201).send({
            message : 'ok!'
        });
    }else{
        return res.status(405).send({
            message : 'already voted!'
        });
    }
    
    
}

exports.getUser = async (req, res) => {
    let user;
    try {
        user = await User.findById(req.query.id).populate({
            path : 'entries',
            populate: {
                path : 'challenge',
                model : 'Challenge'
            }
        }).populate({
            path : 'challenges',
            model : 'Challenge'
        })
    }catch(err){
        console.log(err)
    }
    

    return res.status(200).send({
                message : 'ok!',
                user : user
    });
}

exports.postComment = async (req, res) => {
    let challenge = await Challenge.findById(req.body.id);
    challenge.comments.push({
        user : req.userId,
        comment : req.body.comment,
        time : new Date()
    })
    let user = await User.findById(req.userId)
    await challenge.save();
    return res.status(201).send({
        message : 'ok!',
        comment : {
            user : user,
            comment : req.body.comment,
            time : new Date()
        }
});

}

exports.deleteComment = async (req, res) => {
    let challenge = await Challenge.findById(req.body.id);
    for (i = 0; i< challenge.comments.length ; i++){
        console.log(new Date(challenge.comments[i].time).getTime().toString(), new Date(req.body.time).getTime().toString())
        if (new Date(challenge.comments[i].time).getTime().toString() == new Date(req.body.time).getTime().toString()){
            challenge.comments.splice(i,1)
        }
    }
    await challenge.save();
    return res.status(201).send({
        message : 'ok!'
    })
}

exports.deleteSong = async (req, res) => {
    let entry = await Entry.findById(req.body.id);
    let challenge = await Challenge.findById(entry.challenge);

    let user = await User.findById(entry.user);
    challenge.entries.pop(entry);
    challenge.numOfEntries = challenge.numOfEntries - 1;
    user.entries.pop(entry);
    await challenge.save();
    await user.save();
    await entry.remove();
    return res.status(201).send({
        message : 'ok!'
    })
}
exports.deleteChallenge = async (req, res) => {
    let challenge = await Challenge.findById(req.body.id);
    for (i = 0; i< challenge.entries.length; i++){
        let entry = await Entry.findById(challenge.entries[i]);

        let user = await User.findById(entry.user);
        user.entries.pop(entry);
        await user.save();
        await entry.remove();
    }
    let user = await User.findById(challenge.user);
    user.challenges.pop(challenge);
    await user.save();
    await challenge.remove();
    return res.status(201).send({
        message : 'ok!'
    })
}


exports.setLink = async (req, res) => {
    let user = await User.findById(req.body.id);
    user.link = req.body.link;
    await user.save();
    return res.status(201).send({
        message : 'ok!'
    })
}
exports.readInbox = async (req, res) => {
    let inbox = await Inbox.findById(req.body.id);
    inbox.isRead = true;
    let user = await User.findById(req.body.user);
    user.unreadInboxes.pop(req.body.id)
    await user.save();

    await inbox.save()
    return res.status(201).send({
        message : 'ok!'
    })
}
exports.unreadMessages = async (req, res) => {
    let user = await User.findById(req.query.user);

    return res.status(200).send({
            message : 'ok!',
            unreadMessages : user.unreadInboxes.length
        })

}

exports.sendMessage = async (req, res) => {
    let inbox;
    if (req.body.id){
        inbox = await Inbox.findById(req.body.id)

    }else {
        inbox = new Inbox({
            user1 : req.body.user1,
            user2 : req.body.user2
        })
        await inbox.save();
    }
    let user = await User.findById(req.body.user)
    let message = {
        message : req.body.message,
        time : new Date(),
        user : user
    }
    if (req.body.user == inbox.user1){
        let user2 = await User.findById(inbox.user2)
        if (!user2.unreadInboxes.includes(req.body.id)){
            user2.unreadInboxes.push(req.body.id)
        }
        
        await user2.save()
    }else{
        let user1 = await User.findById(inbox.user1)
        if (!user1.unreadInboxes.includes(req.body.id)){
            user1.unreadInboxes.push(req.body.id)
        }
        await user1.save()
    }
    inbox.messages.push(message)
    inbox.lastMessage = new Date()
    inbox.isRead = false;
    await inbox.save()
    return res.status(201).send({
        message : 'ok!',
        message : inbox.messages[inbox.messages.length - 1]

    })
}
exports.deleteInbox = async (req, res) => {
    let inbox = await Inbox.findById(req.body.id);
    if (!inbox.messages){
        await inbox.remove();
    }
    
    return res.status(201).send({
        message : 'ok!'

    })
}
exports.newInbox = async (req, res) => {
    let in1 = await Inbox.findOne({ user1 : req.body.user1, user2: req.body.user2});
    let in2 = await Inbox.findOne({ user1 : req.body.user2, user2: req.body.user1});
    if (in1){
        return res.status(201).send({
            message : 'ok!',
            inbox : in1,
            isNew : false,
    
        })
    }else if (in2){
        return res.status(201).send({
            message : 'ok!',
            inbox : in2,
            isNew : false
    
        })
    }else{
        let inbox = new Inbox({
            user1 : req.body.user1,
            user2 : req.body.user2,
            messages : []
        })
        await inbox.save();
        return res.status(201).send({
            message : 'ok!',
            inbox : inbox,
            isNew : true
    
        })
    }
    
}
exports.getInboxes = async (req, res) => {
    let inboxes = await Inbox.find({ 
        $or : [
            {user1 : req.body.user},
            {user2 : req.body.user}
        ]
    },{ messages: { $slice: -1 }}).sort('-lastMessage').populate({
        path : 'user1',
        model :'User'
    }).populate({
        path : 'user2',
        model : 'User'
    })
    return res.status(201).send({
        message : 'ok!',
        inboxes : inboxes
    })


}

exports.getInbox = async (req, res) => {
    let inbox = await Inbox.findById(req.body.id).populate({
        path : 'user1',
        model :'User'
    }).populate({
        path : 'user2',
        model : 'User'
    }).populate({
        path : 'messages.user',
        model : 'User'
    })
    return res.status(201).send({
        message : 'ok!',
        inbox : inbox
    })
}

exports.playSong = async (req, res) => {
    let song = await Entry.findOne({ songURL : req.body.url});
    if (song.plays){
        song.plays = song.plays + 1;
    }else{
        song.plays = 1;
    }
    
    await song.save();
    return res.status(201).send({
        message : 'ok!'
    })
}

exports.declareAuthorsChoice = async (req, res) => {
    console.log(req.body)
    let entry  = await Entry.findById(req.body.entry);
    let challenge = await Challenge.findById(entry.challenge);
    if (challenge.authorsChoice){
        let entry2 = await Entry.findById(challenge.authorsChoice);
        entry2.authorsChoice = false;
        await entry2.save()
    }
    challenge.authorsChoice = req.body.entry;
    await challenge.save();
   
    entry.authorsChoice  = true;
    await entry.save();
    console.log(challenge)
    return res.status(201).send({
        message : 'ok!'
    })

}