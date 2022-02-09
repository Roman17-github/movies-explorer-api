const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;


const getMyUser = (req, res, next) => {
    return User.findById(req.user._id)
        .orFail(() => {
            const error = new Error('Пользователь не найден');
            error.name = 'UserNotFoundError';
            error.statusCode = 404;
            throw error;
        })
        .then((I) => {
            res.status(200).send(I);
        })
        .catch(next);
};

const createUser = (req, res, next) => {
    
    const { email, password, name } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (user) {
                const error = new Error('Такой email уже существует ');
                error.statusCode = 409;
                throw error;
            }
            return bcrypt.hash(password, 10);
        })
        .then((hash) => User.create({ email, password: hash, name }))
        .then((user) => {
            res.status(200).send({ message: `Пользователь ${user.name} успешно зарегистрирован` });
        })
        .catch((er) => {
            const err = er;
            if (err.name === 'ValidationError') {
                err.statusCode = 400;
            }
            next(err);
        });
};

const upDateUser = (req, res, next) => {
    const { name, about } = req.body;

    return User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true },
    )
        .orFail(() => {
            const error = new Error('Пользователь не найден');
            error.name = 'UserNotFoundError';
            error.statusCode = 404;
            throw error;
        })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((er) => {
            const err = er;
            if (err.name === 'ValidationError') {
                err.statusCode = 400;
                err.message = 'некорректные данные';
            } else if (err.name === 'CastError') {
                err.statusCode = 400;
                err.message = 'некорректный id';
            }
            next(err);
        });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
            res.cookie('jwt', token, {
                maxAge: 3600000,
                httpOnly: true
            });
            res.status(200).send({ jwt: token });
        })
        .catch((er) => {
            const err = er;
            if (err.message === 'InvalidLogin') {
                err.statusCode = 401;
            }
            next(err);
        });
};

module.exports = { getMyUser, upDateUser, createUser, login }