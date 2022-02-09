const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { getMyUser, upDateUser } = require('../controllers/users');


router.get('/me', getMyUser);
router.patch('/me',celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }), upDateUser);

module.exports = router;

