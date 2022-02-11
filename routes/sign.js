const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { signupValidation, loginValidation } = require('../utils/validation');

router.post(
  '/signup',
  signupValidation,
  createUser,
);
router.post(
  '/signin',
  loginValidation,
  login,
);

module.exports = router;
