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
const Room = db.Room;
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

const roomService = require('./rooms/room.service');

app.use('/users', require('./users/users.controller'));     // Users api endpoints
app.use('/rooms', require('./rooms/rooms.controller'));     // Rooms api endpoints

app.use(errorHandler);

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`listening on ${port}`);
});

io.on('connection', (socket) => {
    let _user = undefined;

    socket.emit('connected', {message:"hi"});

    const updateUsersInRoom = (roomId) => {
        roomService.users(roomId).then(usrs => socket.to(roomId).emit('userList', usrs));
    };

    socket.on('disconnect', () => {
        console.log('disconnecting')
        roomService.leaveRoom(socket.room, _user);
        updateUsersInRoom(socket.room);
    });

    socket.on('connected', (roomId, user) => {
        _user = user;
        if (socket.room) {
            console.log('connecting')
            socket.leave(socket.room);
            roomService.leaveRoom(socket.room, user);
            updateUsersInRoom(socket.room);
        }

        socket.room = roomId;
        socket.join(roomId); 
        roomService.joinRoom(roomId, user);
        updateUsersInRoom(roomId);

        Drawing.find({roomid: roomId},(err, drawings) => socket.emit('drawHistory', drawings));
        ChatMessage.find({roomid: roomId},(err, messages) => socket.emit('chatHistory', messages));
        Room.findById(roomId, (err, room) => socket.emit('roomInfo', room));
    });

    socket.on('draw', (data) =>{
        console.log("Got drawing");
        console.log(data);
        socket.broadcast.to(data.roomid).emit('draw', data);
        const drawing = new Drawing(data);
        drawing.save();
        if (roomService.join({ id: data.roomid, username: data.user })) updateUsersInRoom(data.roomid);
    });

    socket.on("hideUser", (id, name) => {
        Room.findOne({_id: id},
            (err, room) => {
                console.log(room.name);
                if((name in room.users) && !(name in room.hiddenUsers)){
                    room.hiddenUsers.append(name);
                    room.save();
                    socket.broadcast.to(id).emit('hideUser', id, name);
                }
            }
        );
    });

    socket.on("showUser", (id, name) =>{
        Room.findOne({_id: id},
            (err, room) => {
                console.log(room.name);
                if((name in room.users) && (name in room.hiddenUsers)){
                    room.hiddenUsers.remove(name);
                    room.save();
                    socket.broadcast.to(id).emit('showUser', id, name);
                }
            }
        );
    })

    socket.on("undo", (id, name, line) => {
        Drawing.find({ user: name, roomid: id },
            (err, result) => {
                Drawing.findOneAndDelete({ _id: result[result.length-1]._id }, function (err) {
                    if(err) console.log(err);
                });
                if(result[result.length-1].erase) {
                    io.in(id).emit("undo erase", result[result.length-1]);
                } else {
                    io.in(id).emit("undo", name);
                }
            }
        );
    });

    socket.on("erase", (data) => {
        socket.broadcast.to(data.roomid).emit('erase', data);
        const drawing = new Drawing(data);
        drawing.save();
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

