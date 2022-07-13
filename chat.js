const uuidv4 = require('uuid').v4;

const messages = new Set();
const users = [{id:0, name: "Anonymous", password: "Anonymous"},
{id: 1, name: "Aadhav", password: "123"},{id: 2, name: "Pritika", password: "123"}];
let user = null;

const messageExpirationTimeMS = 5*60*1000;

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    socket.on('getMessages', () => this.getMessages());
    socket.on('userLogin',(value) => this.getUser(value))
    socket.on('message', (value,name) => this.handleMessage(value,name));
    socket.on('userLogout', () => this.userLogout());
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  getUser(value){
    user = null;
    users.forEach((person) => {
      if(person.name === value.name && person.password === value.password){
        user = person;
    }});
  this.io.sockets.emit('userLogin', {userLogin: user !== null, socketID: this.socket.id});
  }
  
  sendMessage(message) {
    this.io.sockets.emit('message', message);
  }
  
  getMessages() {
    messages.forEach((message) => this.sendMessage(message));
  }

  handleMessage(value, name) {
    users.forEach((person) => {
      if(person.name === name)
        user = person;
    });

    const message = {
      id: uuidv4(),
      socketID: this.socket.id,
      user: user,
      value,
      time: Date.now()
    };
  
    messages.add(message);
    this.sendMessage(message);

    setTimeout(
      () => {
        messages.delete(message);
        this.io.sockets.emit('deleteMessage', message.id);
      },
      messageExpirationTimeMS,
    );
  }

  disconnect() {
    this.io.sockets.emit('userLogin', false);
  }

  userLogout() {
    this.io.sockets.emit('userLogin', {userLogin: false, socketID: this.socket.id});
  }
}

function chat(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);   
  });
};

module.exports = chat;