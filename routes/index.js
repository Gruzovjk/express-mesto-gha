const router = require('express').Router();
const { validateSignUp, validateSignIn } = require('../middlewares/validator');
const { NotFoundError } = require('../errors/index');

const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.use('/users', auth, usersRoutes);
router.use('/cards', auth, cardsRoutes);
router.use('*', auth, () => {
  throw new NotFoundError('По указанному URL ничего нет');
});

module.exports = router;
