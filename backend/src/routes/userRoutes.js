const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const isAuth = require('../middlewares/is-auth');

router.get('/', userController.getUsers);

router.get('/:userId', isAuth, userController.getLoggedUser);

router.post(
  '/signup',
  [
    body('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
    body('password', 'password length should be at least 6 characters')
      .trim()
      .isLength({ min: 6 }),
    body('name', 'name is required').trim().not().isEmpty(),
  ],
  userController.signUp
);

router.post('/login', userController.login);

module.exports = router;
