const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('helpers/db');
const Room = db.Room;
const User = db.User;

module.exports = {
    getAll,
    getById,
    create,
    join,
    update,
    delete: _delete
};

async function getAll({user}) {
    const userType = await User.findOne({username: user});
    if(userType.admin){
        return await Room.find({});
    }
    else{
        return  await Room.find({$or:[{"users": { $all : [user] }},{isPrivate: false}]});
    }
}

async function getById(id) {
    return await Room.findById(id);
}

async function create(RoomParam) {
    if (await Room.findOne({ name: RoomParam.name })) {
        console.log("Room name taken");
        throw 'Roomname "' + RoomParam.name + '" is already taken';
    }
    const room = new Room(RoomParam);
    console.log("Made room");
    return await room.save();
}

async function join({id, username}) {
    // TODO: check if room and user exists
    const room = await Room.findById(id);
    if (!room.users.includes(username)){
        room.users.push(username);
    }
    await room.save();
}

async function update(id, RoomParam) {
    const Room = await Room.findById(id);

    if (!Room) throw 'Room not found';
    if (Room.name !== RoomParam.name && await Room.findOne({ name: RoomParam.name })) {
        throw 'Room "' + RoomParam.name + '" is already taken';
    }

    Object.assign(Room, RoomParam);

    await Room.save();
}

async function _delete(id) {
    await Room.findByIdAndRemove(id);
}