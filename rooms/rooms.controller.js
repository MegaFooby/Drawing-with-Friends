const express = require('express');
const router = express.Router();
const roomService = require('./room.service');

// routes
router.post('/create', create);
router.post('/join', join);
router.post('/', getAll);
router.post('/:id/users', getUsers);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    roomService.create(req.body)
        .then((room) => res.json(room))
        .catch(err => next(err));
}

function join(req, res, next) {
    roomService.join(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    roomService.getAll(req.body)
        .then(rooms => res.json(rooms))
        .catch(err => next(err));
}

function getUsers(req, res, next) {
    roomService.users(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    roomService.getById(req.params.id)
        .then(room => room ? res.json(room) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    roomService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    roomService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}