const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { validationResult } = require('express-validator');
const { application } = require('../config');
const HttpError = require('../models/http-error.model');

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Sign up failed, please try again.', 500));
  }

  if (existingUser) {
    return next(
      new HttpError('User exists already, please login instead.', 422)
    );
  }

  let hashedPw;
  try {
    hashedPw = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError('Could not create user, please try again!', 500));
  }

  const user = new UserModel({
    name,
    email,
    password: hashedPw,
  });

  try {
    await user.save();
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }
  let token;
  try {
    token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      application.jwtToken,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }
  res
    .status(201)
    .json({ token, userId: user._id.toString(), email: user.email });
};

exports.getLoggedUser = async (req, res, next) => {
  const userId = req.userId;
  try {
    const result = await UserModel.findById(userId);
    res.status(201).json(result);
  } catch (err) {
    next(
      new HttpError('Fetching user data failed, please try again later.', 500)
    );
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 30;
    const users = await UserModel.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(201).json(users);
  } catch (err) {
    return next(
      new HttpError('Fetching users failed, please try again later.', 500)
    );
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;

  try {
    user = await UserModel.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Logging in failed, please try again.', 500));
  }

  if (!user) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 403)
    );
  }

  let isPasswordValid = false;

  try {
    isPasswordValid = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(
      new HttpError(
        'Could not log you in, please check your credentials and try again!',
        500
      )
    );
  }

  if (!isPasswordValid) {
    const error = new Error('Wrong Password');
    error.statusCode = 401;
    return next(
      new HttpError('Invalid credentials, could not log you in.', 403)
    );
  }
  let token;
  try {
    token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      application.jwtToken,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return next(new HttpError('Logging in failed, please try again.', 500));
  }
  const data = {
    token: token,
    userId: user._id.toString(),
    email: user.email,
  };
  res.status(200).json(data);
};
