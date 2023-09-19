var express = require('express')
var mongoose = require('mongoose');

var app = express()

var dburl = "mongodb://127.0.0.1:27017/chatApplication"
mongoose.connect(dburl , { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

var Message = mongoose.model('Message',{ name : String, message : String})

var server = app.listen( 3000 , ()=>{
    console.log("server is running on port : ",server.address().port);
})

var bodyParser = require('body-parser')


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// app.get('/messages', (req, res) => {
//     console.log("req :",req.body);
//     const msg = Message.find({})
//     if(msg){
//         return res.status(200).send({"message":"message recieved successfully...","msg" : msg})
//     }else{
//         return res.status(400).send({"message":"message NOT recieved"});
//     }
// })

app.get('/messages', (req, res) => {
    console.log("req:", req.body);
    Message.find({})
      .then((msg) => {
        if (msg) {
          return res.status(200).send({ "message": "message received successfully...", "msg": msg });
        } else {
          return res.status(400).send({ "message": "message NOT received" });
        }
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        return res.status(500).send({ "message": "Internal server error" });
      });
  });

  app.post('/messages',(req,res)=>{
    console.log("post req : ",req.body);
    var message = new Message(req.body);
    message.save()
    .then((msg)=>{
        if(msg){
            return res.status(200).send({"message":"message saved successfully","msg" :msg});
        }else{
            return res.status(400).send({ "message": "message NOT saved" });
        }
    })
    .catch((err)=>{
        console.log("error fetching message :",err);
        return res.status(500).send({"message":"Internal server err"})
    })
  })
