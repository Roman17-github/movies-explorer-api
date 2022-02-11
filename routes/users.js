const router = require('express').Router();
const { getMyUser, upDateUser } = require('../controllers/users');
const { updateValidation } = require('../utils/validation');

router.get('/users/me', getMyUser);
router.patch('/users/me', updateValidation, upDateUser);

module.exports = router;
