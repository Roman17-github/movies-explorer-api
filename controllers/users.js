const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const InvalidLoginError = require('../errors/invalidLoginError');
const { send } = require('express/lib/response');

const { NODE_ENV, JWT_SECRET } = process.env;

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
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
        throw new ConflictError('Пользователь с таким email уже сушествует');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      res
        .status(200)
        .send({ message: `Пользователь ${user.name} успешно зарегистрирован` });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неккоректные данные'));
      } else {
        next(err);
      }
    });
};

const upDateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id, { email, name }, { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неккоректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже сушествует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 36000000,
        httpOnly: true,
        sameSite: 'None',
        secure:true,
        
      });
      res.status(200).send({ jwt: token });
    })
    .catch((err) => {
      if (err.message === 'InvalidLogin') {
        next(new InvalidLoginError('Неправильный логин или пароль'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMyUser,
  upDateUser,
  createUser,
  login,
};