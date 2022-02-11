const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');
const auth = require('../middlewares/auth');

router.use(require('./sign'));

router.use(auth);

router.use(require('./users'));
router.use(require('./movie'));

router.get('/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});

router.use('/', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = router;
