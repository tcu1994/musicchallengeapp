var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
const https = require(`https`);
var fs = require('fs');
var path = require('path')
const cors = require('cors')

app.use(cors())
const AWS=  require('aws-sdk')
const http = require('http')
const port = process.env.PORT || 8080
const dotenv = require('dotenv');
dotenv.config();
require('express-async-errors');
const multer = require("multer");
const storage = multer.memoryStorage()
   
  const upload = multer({ storage: storage })



//   const options = {
//     key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
//     cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
//   };



var mainRouter = require('./routes/main');
var authRouter = require('./routes/auth');
var morgan = require('morgan')
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const Challenge = require('./models/challenge');
const Entry = require('./models/entry');
const cron = require('node-cron');
cron.schedule('0 0 * * *', async function() {
    let challenges = await Challenge.find({hasEnded : false}).populate({ path : 'entries', model :'Entry'})
    for (let i = 0; i< challenges.length ; i++){
        let date = new Date(challenges[i].createdAt)
        date.setDate(date.getDate() + 7)
        if ( date < new Date()){
            let arr = []
            for (let j = 0; j < challenges[i].entries.length; j++){
                if (challenges[i].entries[j].votes){
                    arr.push(challenges[i].entries[j].votes)
                }
                else{
                    arr.push(0)
                }
            }
            let entry = await Entry.findOne(challenges[i].entries[arr.indexOf(Math.max(...arr))])
            entry.winner = true;
            await entry.save()
            challenges[i].winner = entry._id;
            challenges[i].hasEnded = true;
            await challenges[i].save()
        }
    }
  });



app.use('/', mainRouter);
app.use('/auth', authRouter);





var namer = require('color-namer')

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  })

  const axios = require('axios');
 
  var analyze = require('rgbaster')
  app.post('/upload', upload.single('file'), async (req, res, next) => {
    let colors;
    let colorName
    const file = req.file
    let colorNameFinal1
    let colorNameFinal2
    let colorNameFinal3
    let colorNames;
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'|| file.mimetype == 'image/tiff'){
        try{
        
            let data = { 'photo' : Buffer.from(req.file.buffer).toString('base64')}
            let response = await axios.post((process.env.PROD_PY_SERVER || process.env.PYTHON_SERVER) + '/crunching/photo/', data)
            colors = response.data.colors;
            let colorName1 = namer('#'+colors[0])
            let colorName2 = namer('#'+colors[1])
            let colorName3 = namer('#'+colors[2])
            colorNameFinal1 = colorName1['basic'][0]['name']
            colorNameFinal2 = colorName1['basic'][1]['name']
            colorNameFinal3 = colorName1['basic'][2]['name']
        }catch(err){
            console.log('err',err)
        }
    }
    
    


    let fileName = (Math.random() + 1).toString(36).substring(7)
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    body = Buffer.from(req.file.buffer, 'binary')
    const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${fileName +path.extname(file.originalname)}`,
                Body:  body
    }
    s3.upload(params, (err, data) => {
        if (err) {
            throw (err)
        }
        res.send({
            status: "success",
            message: "File uploaded successfully",
            url: data.Location,
            colors : colors,
            colorNames : [colorNameFinal1, colorNameFinal2, colorNameFinal3]
        });
        
    })
    
    
  })




  
// Set EJS as templatg engine 
app.set("view engine", "ejs");

// Create a server object:
const server = http.createServer(app)


const {MongoClient} = require("mongodb");
const challenge = require('./models/challenge');
  
// Server pat
url = 'mongodb+srv://tonko:tonko123@cluster0.x9vdu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
MongoClient.connect(url, (err,client)=>{
    if(!err) {
        console.log("successful connection with the server");  
    }
    else
        console.log("Error in the connectivity");
})
mongoose.connect(url);

server.listen(port, function (error) {
    if (error) {
        console.log('Something went wrong', error);
    }
    else {
        console.log('Server is listening on port' + port);
    }
})
// const server = https.createServer(options,app)

// server.listen(port, function (error) {
//     if (error) {
//         console.log('Something went wrong', error);
//     }
//     else {
//         console.log('Server is listening on port' + port);
//     }
// })



module.exports = server