require('rootpath')();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const config = require('config.json');
const bodyParser = require('body-parser');
const jwt = require('helpers/jwt');
const errorHandler = require('helpers/error-handler');
const app = express();
const path = require('path');
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    }
});
const db = require('helpers/db');
const { emit } = require('process');
const Drawing = db.Drawing;
const ChatMessage = db.ChatMessage;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(jwt()); // auth for current logged in user
 
app.get('/', (req, res) => {            // Home request
    res.json({
        message: 'Drawing with friends!'
    });
});

app.use('/users', require('./users/users.controller'));     // Users api endpoints
app.use('/rooms', require('./rooms/rooms.controller'));     // Rooms api endpoints

app.use(errorHandler);

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`listening on ${port}`);
});

io.on('connection', (socket) => {
    console.log('Someone connected');

    socket.emit('connected', {message:"hi"});

    socket.on('connected', (id) => {
        socket.room = id;
        socket.join(id); 
        const drawing = Drawing.find({roomid: id},(err, drawings) => {socket.emit('drawHistory', drawings);});
        const chat = ChatMessage.find({roomid: id},(err, messages) => {socket.emit('chatHistory', messages);});
        console.log("Drawings found:"+drawing);
        console.log("Connecting to room " + id);
    });

    socket.on('draw', (data) =>{
        console.log("Got drawing");
        console.log(data);
        socket.broadcast.to(data.roomid).emit('draw', data);
        const drawing = new Drawing(data);
        drawing.save();
    });

    socket.on("undo", (id, name, line) => {
        io.in(id).emit("undo", name);
        const drawing = Drawing.findOneAndDelete({ user: name, roomid: id, json: line }, function (err) {
            if(err) console.log(err);
        });
    });

    socket.on('chat-msg', (data) => {
        console.log(data);
        socket.broadcast.to(data.roomid).emit('chat-msg', data.message);
        const message = new ChatMessage(data);
        message.save();
    });
});

async function main() {

    const db = new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true} );

    try {
        // Connect to the MongoDB cluster
        await db.connect();

        // Make the appropriate DB calls
        await listDatabases(db);

    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await db.close();
    }
}

main().catch(console.error);


//simple connection verification function. Prints existing databases to console
async function listDatabases(db) {
    databasesList = await db.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};