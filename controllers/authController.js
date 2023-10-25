const Auth = require('../models/authModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const util = require('util');
const crypto = require('crypto');
const getToken = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRED,
  });
  return token;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const authenticatedUsers = await Auth.find();

    res.status(200).json({
      status: 'sucess',
      users: authenticatedUsers,
    });
  } catch (error) {
    res.staus(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, passwordModifiedAt, role } =
      req.body;

    const user = new Auth({
      name,
      email,
      role,
      password,
      passwordConfirm,
      passwordModifiedAt,
    });

    const data = await user.save();
    data.password = '';
    const token = getToken(data._id);
    res.status(201).json({
      status: 'Yay! user signed in',
      data,
      token,
    });
  } catch (error) {
    res.status(401).json({
      status: error,
      error: error.message,
    });
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error('Please privide your email and password!');
    }

    //1. find email users.
    const user = await Auth.findOne({ email }).select('+password');
    const correct = user
      ? await user.correctPassword(password, user.password)
      : 'null';

    if (!user || !correct) {
      throw new Error('Invalid user name or password');
    }

    const token = getToken(user._id);
    user.password = '';

    res.status(201).json({
      status: 'User logged in',
      user,
      token,
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.protection = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    ) {
      throw new Error('Your token is not valid');
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await util.promisify(jwt.verify)(token, process.env.SECRET);
    let { id, iat } = decoded;
    const user = await Auth.findById(id);

    if (!user) {
      throw new Error('Not a valid user');
    }

    if (user.passwordModifiedAt) {
      /*date > iat ==> return error*/
      if (user.passwordModifiedAt.getTime() / 1000 > iat) {
        throw new Error('you need to login again!');
      }
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new Error(`You don't have permission to access this`);
      }

      next();
    } catch (error) {
      res.status(400).json({ status: 'error', error: error.message });
    }
  };
};

exports.deleteManyUesrs = async (req, res, next) => {
  try {
    const user = await Auth.deleteMany({});
    console.log('user', user);
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    res.status(400).json({
      sttaus: 'error',
      message: error.message,
    });
  }
};

// password reset functionality

exports.forgotPassword = async (req, res, next) => {
  try {
    //1. find the user by its email account:
    const { email } = req.body;
    const user = await Auth.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    //2. create new token as a password
    const resetToken = user.createResetToken();
    const result = await user.save({ validateBeforeSave: false });

    //3. Send it to users email
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/${resetToken}`;
    const options = {
      email,
      subject: 'Reset your password',
      message: `Forgot your password, submit a patch request with your new password and passwordConfirm to : ${resetUrl}.\n if you didn't forgout your passwotrd, pleadse ignore this email`,
    };

    sendEmail(options);

    res.status(201).json({
      status: 'success',
      message:
        'Password reset link is sent to mail, Go and change your password',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    //1. get token and find user, need to again encrypt token
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;
    const encryptedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await Auth.findOne({
      passwordResetToken: encryptedToken,
      passwordResetExpires: { $gte: Date.now() },
    });

    if (!user) {
      throw new Error('You password token expires!');
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const jwt = getToken(user._id);
    user.password = undefined;
    user.passwordConfirm = undefined;

    res.status(201).json({
      status: 'updated',
      user,
      token: jwt,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await Auth.findById({ _id: id }).select('+password');
    const { currentPassword, password, passwordConfirm } = req.body;
    const correct = await user.correctPassword(currentPassword, user.password);

    if (!correct) {
      throw new Error('Invalid Password');
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;

    await user.save();
    user.password = undefined;
    user.passwordConfirm = undefined;
    const jwt = getToken(user._id);

    res.status(201).json({
      status: 'success',
      user,
      token: jwt,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    console.log(req.body);
    res.status(201).json({
      status: 'succes',
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
