var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    chatroom: String,
    messages: [{
        username: {type: String},
        message: {type: String},
        type: {type: Number}
    }]
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;