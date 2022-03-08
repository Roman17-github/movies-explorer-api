const router = require('express').Router();
const { createUser, login,remove } = require('../controllers/users');
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

router.post("/remove",remove);

module.exports = router;
