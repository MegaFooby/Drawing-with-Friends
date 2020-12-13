const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('helpers/db');
const Room = db.Room;

module.exports = {
    getAll,
    getById,
    create,
    join,
    update,
    delete: _delete
};

async function getAll({user}) {
    return await Room.find({$or:[{"users": { $all : [user] }},{isPrivate: false}]});
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

async function join({roomname, username}) {
    // TODO: check if room and user exists
    const room = await Room.findOne({ name: roomname });
    room.users.push(username)
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