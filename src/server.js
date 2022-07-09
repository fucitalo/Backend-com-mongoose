const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server); 

mongoose.connect('mongodbserver',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const connectedUsers = {};

io.on('connection',socket=>{
    const  {user_id} = socket.handshake.query;
    connectedUsers[user_id] = socket.id;
})

app.use((req, res, next)=>{
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

// req.query - Acessar query params (filtros)
// req.params - Acessar route params (edit, delete)
// req.body - Acessar corpo da requisição

/*app.get('/users', (req, res)=>{
    return res.json({"idade":req.query.idade});
});*/

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3334);
