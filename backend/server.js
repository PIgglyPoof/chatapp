var express = require('express');
var app = express();
var http = require('http').createServer(app);
var mongoose = require('mongoose');
var cors = require('cors');
var bcrypt = require('bcryptjs');
var path = require('path');
var jwt = require('jsonwebtoken');
var io = require('socket.io')(http, {
  cors: {
      origins: ['http://localhost:4200']
  }
});


var db = mongoose.connect('mongodb+srv://sohail:pokemon@cluster0.bvvzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }, function(err, res){
  if(err){
    console.log("failed to connect to database");
  }
  else{
    console.log("successfully connected to mongodb database");
  }
});

// files related variables
var multer = require('multer');
var store = multer.diskStorage({
  destination:function(req,file,cb){
      cb(null, './uploads');
  },
  filename:function(req,file,cb){
      cb(null, Date.now()+'.'+file.originalname);
  }
});
var upload = multer({storage:store}).single('file');


// schema variables
var User = require('./models/User');
var Chatroom = require('./models/Chatroom');
var Message = require('./models/Message');

const verify = require('./routes/verifytoken');

app.use(cors({
  origin: true,
  credentials: true,
  methods: 'POST,GET,PUT,OPTIONS,DELETE'
}));

app.use(express.json());

app.set('socketio', io);

var userList = new Map();

// upload file
app.post('/upload', verify, upload, function(req,res){
  console.log(req.file);
  console.log(req.user);
  console.log(req.header('Chatroom'));
  res.status(200).send({filename: req.file.filename});
});

app.get('/download', verify, function(req,res){
  console.log(req.header('filename'));
  res.sendFile(path.join(__dirname,'uploads')+'/'+req.header('filename'));
});


// api to register user
app.post('/register', async (req, res) => {

  var start = new Date();

  //console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  var user = new User();
  user.username = username;
  user.password = hashPassword;

  user.save((err, result) => {
    if(err){
      
      res.status(500).send("failed to register user");
    }
    else{
      res.send(result);
    }
  });
  
});

// api to login
app.post('/login', async (req, res) => {
  
  const user = await User.findOne({username: req.body.username});
  if(!user){
    return res.status(500).send("username is wrong");
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass){
    return res.status(500).send("password is wrong");
  }

  const token = jwt.sign({username: user.username}, "token_secret");
  const username = user.username;

  res.send({token: token, username: username});

});

// api to create chatroom
app.post('/chatroom/create', verify, (req, res) => {
  User.findOne({username: req.user.username}, (err, user) => {
    if(err){
      res.status(500).send("username doesn't exist");
    }
    else{
      Chatroom.findOne({name: req.body.name}, (err, chatroom) => {
        if(err){
          consolge.log(err);
          res.status(500).send("Server Error, Try Again Later !!!");
        }
        else if(!chatroom){
          const chatroom = new Chatroom();
          chatroom.name = req.body.name;
          chatroom.owner = user._id;
          chatroom.save((err, result) => {
            if(err){
              res.status(500).send("failed to create chat room");
            }
            else{
              res.status(200).send("chatroom created successfully");
            }
          });
        }
        else{
          res.status(500).send("Chatroom Already Exist !!!");
        }
      });
    }
  });
});

// api to get all chatroom
app.post('/chatroom/all', verify, (req, res) => {
  Chatroom.find({}, {name: true}, (err, chatrooms) => {
    if(err){
      console.log(err);
      res.status(500).send("Couldn't find chatrooms");
    }
    else{
      res.status(200).send(chatrooms);
    }
  });
});

// api to get all chats
app.post('/chatroom/:chatroom', verify, (req, res) => {
  Message.findOne({chatroom: req.params.chatroom}, (err, chatroom) => {
    if(chatroom==null){
      console.log(err);
      res.status(200).send([]);
    }
    else{
      res.status(200).send(chatroom.messages);
    }
  });
});

io.on('connection', (socket) => {

    // if token is null or invalid then send error message
    console.log(socket.handshake.auth.token);
    var user = jwt.verify(socket.handshake.auth.token, "token_secret");
    var username = user.username;
    var chatroom = socket.handshake.auth.chatroom;

    socket.on('user', (chatroom) => {
      if(!userList.has(chatroom)){
        userList.set(chatroom, new Set());
      }
      userList.get(chatroom).add(username);
      socket.broadcast.emit(chatroom+'-user', Array.from(userList.get(chatroom)));
      socket.emit(chatroom+'-user', Array.from(userList.get(chatroom)));
    });

    socket.on('message', (msg) => {
      console.log(msg);
      Message.findOne({chatroom: msg.chatroom}, (err, chatroom) => {
        console.log(chatroom);
        if(chatroom==null){
          chatroom = new Message();
          chatroom.chatroom = msg.chatroom;
          chatroom.messages = [];
          chatroom.messages.push({message: msg.message, username: username, type: msg.type});
          chatroom.save((err, result) => {
            if(err){
              console.log(err);
            }
            else{
              socket.emit(msg.chatroom, {username: username, message: msg.message, type: msg.type});
              socket.broadcast.emit(msg.chatroom, {username: username, message: msg.message, type: msg.type});
            }
          });
        }
        else{
          chatroom.messages.push({message: msg.message, type: msg.type, username: username});
          chatroom.save((err, result) => {
            if(err){
              console.log(err);
            }
            else{
              socket.emit(msg.chatroom, {username: username, message: msg.message, type: msg.type});
              socket.broadcast.emit(msg.chatroom, {username: username, message: msg.message, type: msg.type});
            }
          });
        }
      });
    });

    socket.on('file', (msg) => {
      console.log(msg);
      Message.findOne({chatroom: msg.chatroom}, (err, chatroom) => {
        console.log(chatroom);
        if(chatroom==null){
          chatroom = new Message();
          chatroom.chatroom = msg.chatroom;
          chatroom.messages = [];
          chatroom.messages.push({message: msg.message, username: username, type: msg.type});
          chatroom.save((err, result) => {
            if(err){
              console.log(err);
            }
            else{
              socket.emit(msg.chatroom, {username: username, message: msg.message, type: msg.type});
              socket.broadcast.emit(msg.chatroom, {username: username, message: msg.message, type: msg.type});
            }
          });
        }
        else{
          chatroom.messages.push({message: msg.message, type: msg.type, username: username});
          chatroom.save((err, result) => {
            if(err){
              console.log(err);
            }
            else{
              socket.emit(msg.chatroom, {username: username, message: msg.message, type: msg.type});
              socket.broadcast.emit(msg.chatroom, {username: username, message: msg.message, type: msg.type});
            }
          });
        }
      });
    });

    socket.on('disconnect', () => {
      userList.get(chatroom).delete(username);
      socket.broadcast.emit(chatroom+'-user', Array.from(userList.get(chatroom)));
    });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});